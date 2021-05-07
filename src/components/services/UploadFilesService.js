import axios from "axios";
const baseURL = "http://localhost:8888";

class UploadFilesService {
    upload(company, file, onUploadProgress) {

        if (!company) {
            company = "General";
        }
        let formData = new FormData();

        formData.append("file", file);

        return axios.post(baseURL + "/files/upload-file/" + company, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }

    getFiles() {
        return axios.get(baseURL + "/files/");
    }

    getFilesByCompany(company) {
        return axios.get(baseURL + "/files/" + company);
    }

    deleteFilesByCompany(company, file) {
        return axios.delete(baseURL + "/files/" + company + '/' + file);
    }
}

export default new UploadFilesService();