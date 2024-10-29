let importData = null; // Temporary storage (in-memory)

export async function POST(request) {
  const { artist, song, lyrics } = await request.json();

  // Store the data in memory
  importData = { artist, song, lyrics };

  console.log(importData);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Function to get the stored data (to be used in the importing page)
export function getImportData() {
  return importData;
}
