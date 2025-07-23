import { createClient } from '@/utils/supabase/server';

export default async function TestDB() {
  const supabase = await createClient();
  
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error.message}
          </div>
        </div>
      );
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> Connected to Supabase database.
        </div>
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify({ connection: 'successful', data }, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Connection Failed:</strong> {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
}