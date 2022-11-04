// a simple GET call
export async function getData(url = "") {
	const response = await fetch(url, {
		method: "GET"
	});
	return response.json();
}