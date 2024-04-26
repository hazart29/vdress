export default async function fetchData() {
  try {
    const response = await fetch('data/dataPlayer.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}