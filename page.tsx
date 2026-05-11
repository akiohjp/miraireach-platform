import { createClient } from '@/utils/supabase/server';

export default async function TestDbPage() {
  // サーバー用クライアントを初期化
  const supabase = await createClient();

  // test_table からデータを取得
  const { data: testData, error } = await supabase
    .from('test_table')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Supabase 接続エラー</h1>
        <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">Supabase 接続テスト成功！ 🎉</h1>
      {testData && testData.length > 0 ? (
        <ul className="space-y-4">
          {testData.map((item) => (
            <li key={item.id} className="border p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">ID: {item.id}</p>
              <p className="text-lg font-medium">{item.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>データがありません。（テーブルは存在しますが、空です）</p>
      )}
    </div>
  );
}