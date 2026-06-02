const BASE_URL = 'http://103.151.63.71:8013/api';

async function requestAPI(endpoint, method = 'GET', bodyData = null){
	const headers = {
		'Content-Type': 'application/json',
	};

	const accessToken = localStorage.getItem('access_token');
	console.log("Apakah ada? " + accessToken)
	if(accessToken){
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const config = {
		method: method,
		headers: headers,
	};

	if (bodyData){
		config.body = JSON.stringify(bodyData);
	}

	try{
		const str = `${BASE_URL}${endpoint}`;
		console.log(str)
		const response = await fetch(`${BASE_URL}${endpoint}`, config);

		if(response.status == 401){
			alert('Sesi Anda telah habis atau Anda belum login.');
			localStorage.clear();
			window.location.hash = '#login';
			return null;
		}

		const data = await response.json();

		return {status: response.status, data: data};
	} catch (error){
		console.error('Terjadi kesalahan koneksi API:', error);
		alert('Gagal terhubung ke server backend.');
		return null;
	}
}