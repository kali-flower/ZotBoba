export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const keyword = searchParams.get('keyword');
    const type = searchParams.get('type');
    const radius = searchParams.get('radius');

    const [lat, lng] = location!.split(',');

    const body = {
        includedTypes: keyword?.includes('boba')
            ? ['tea_house']
            : ['cafe', 'coffee_shop'],
        maxResultCount: 20,
        locationRestriction: {
            circle: {
                center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
                radius: parseFloat(radius!)
            }
        }
    };

    const response = await fetch(
        'https://places.googleapis.com/v1/places:searchNearby',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY!,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.rating,places.currentOpeningHours,places.types,places.formattedAddress,places.priceLevel'
            },
            body: JSON.stringify(body)
        }
    );

    const data = await response.json();
    return Response.json(data);
}