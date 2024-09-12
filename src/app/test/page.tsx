const Tets: React.FC = async () => {
    const userId = 7000001;
    const rarity = 'SSR';

    async function fetchApiGacha(typeFetch: string, dataFetch: any) {
        const data = { userId, typeFetch, dataFetch };

        const response = await fetch('/api/gacha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    }

    const dataFetch = rarity;
    const data = await fetchApiGacha('getGachaItem', dataFetch);
    console.log('data item gacha : ', data);

    return (
        <>
        </>
    )
}

export default Tets;