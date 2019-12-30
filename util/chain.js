import axios from './axios';

const baseUrl = 'http://localhost:8091';
const apiMetadata = `${baseUrl}/api/did`;
const apiConvertion = `${baseUrl}/api/convertion`;

export async function getMetadata(id) {
    return axios.get(`${apiMetadata}/${id}`);
}

export async function convert(identifier, type) {
    return axios.get(apiConvertion, {
        params: {
            identifier,
	  type
        }
    });
}
