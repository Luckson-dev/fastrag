import axios from 'axios';

export function handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as { detail?: string };
        const status = error.response?.status;
        const message = serverError?.detail || error.message;
        throw new Error(
            status
                ? `Erreur serveur (${status}): ${message}`
                : `Erreur réseau : ${message}`
        );
    }
    throw new Error('Une erreur inattendue est survenue.');
}
