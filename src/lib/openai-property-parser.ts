import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface ParsedProperty {
  address: string
  city: string
  state: string
  zipCode: string
  price: string
  bedrooms?: number
  bathrooms?: number
  hoa?: string
  sourceUrl: string
  sourceLogo: 'zillow' | 'redfin' | 'realtor' | 'other'
  sqft?: number
  yearBuilt?: number
  lotSize?: string
  propertyType?: string
  description?: string
}

export async function parsePropertyWithAI(url: string): Promise<ParsedProperty> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
    // Return demo data if no API key
    return {
      address: '123 Demo Street',
      city: 'Denver',
      state: 'CO',
      zipCode: '80205',
      price: '625000',
      bedrooms: 3,
      bathrooms: 2.5,
      hoa: '0',
      sourceUrl: url,
      sourceLogo: getDomainLogo(url),
      sqft: 2100,
      yearBuilt: 2015,
      propertyType: 'Single Family',
      description: 'Demo property data (OpenAI API key not configured)'
    }
  }

  try {
    console.log('Starting OpenAI request for URL:', url)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a real estate data extraction assistant. When given a property listing URL, you need to visit the page and extract detailed property information. Return the information in the exact JSON structure requested using the function call.

Important guidelines:
- Extract accurate information from the listing page
- If information is not available, use null or reasonable defaults
- For price, remove $ and commas (e.g., "$650,000" becomes "650000")
- For bedrooms/bathrooms, use numbers (e.g., 3, 2.5)
- For HOA, extract monthly fee amount or use "0" if none
- Be precise with the address components (street, city, state, zip)
- Extract additional details like square footage, year built, lot size when available`
        },
        {
          role: "user",
          content: `Please extract property information from this listing URL: ${url}

Visit the page and extract all available property details including:
- Full address (street, city, state, zip code)
- Listing price
- Bedrooms and bathrooms
- Square footage
- Year built
- HOA fees
- Property type
- Lot size
- Brief description

Return the structured data using the extractPropertyData function.`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extractPropertyData",
            description: "Extract structured property data from a real estate listing",
            parameters: {
            type: "object",
            properties: {
              address: {
                type: "string",
                description: "Street address of the property"
              },
              city: {
                type: "string",
                description: "City name"
              },
              state: {
                type: "string",
                description: "State abbreviation (e.g., CO, CA, TX)"
              },
              zipCode: {
                type: "string",
                description: "ZIP code"
              },
              price: {
                type: "string",
                description: "Listing price as number string without $ or commas"
              },
              bedrooms: {
                type: "integer",
                description: "Number of bedrooms"
              },
              bathrooms: {
                type: "number",
                description: "Number of bathrooms (can be decimal like 2.5)"
              },
              hoa: {
                type: "string",
                description: "Monthly HOA fee as number string, or '0' if none"
              },
              sqft: {
                type: "integer",
                description: "Square footage of the property"
              },
              yearBuilt: {
                type: "integer",
                description: "Year the property was built"
              },
              lotSize: {
                type: "string",
                description: "Lot size (e.g., '0.25 acres', '7,200 sq ft')"
              },
              propertyType: {
                type: "string",
                description: "Type of property (e.g., 'Single Family', 'Condo', 'Townhouse')"
              },
              description: {
                type: "string",
                description: "Brief description or key features of the property"
              }
            },
            required: ["address", "city", "state", "zipCode", "price"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "extractPropertyData" } }
    })

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0]
    if (!toolCall || toolCall.type !== 'function' || !toolCall.function.arguments) {
      throw new Error('Failed to extract property data from OpenAI response')
    }

    const extractedData = JSON.parse(toolCall.function.arguments)
    console.log('Successfully extracted property data:', extractedData)
    
    // Add source information
    return {
      ...extractedData,
      sourceUrl: url,
      sourceLogo: getDomainLogo(url),
    }

  } catch (error) {
    console.error('OpenAI property parsing error:', error)
    
    // Return fallback data with error indication
    return {
      address: '123 Example Street (Error)',
      city: 'Denver',
      state: 'CO',
      zipCode: '80205',
      price: '625000',
      bedrooms: 3,
      bathrooms: 2.5,
      hoa: '0',
      sourceUrl: url,
      sourceLogo: getDomainLogo(url),
      sqft: 2100,
      propertyType: 'Unknown',
      description: `Failed to parse listing: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

function getDomainLogo(url: string): 'zillow' | 'redfin' | 'realtor' | 'other' {
  const hostname = new URL(url).hostname.toLowerCase()
  
  if (hostname.includes('zillow')) return 'zillow'
  if (hostname.includes('redfin')) return 'redfin'
  if (hostname.includes('realtor')) return 'realtor'
  return 'other'
}