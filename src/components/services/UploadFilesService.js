import axios from "axios";

class UploadFilesService {
    upload(company, file, onUploadProgress) {

        if (!company) {
            company = "General";
        }
        let formData = new FormData();

        formData.append("file", file);

        return axios.post("/files/upload-file/" + company, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }

    getFiles() {
        return axios.get("/files/");
    }

    getFilesByCompany(company) {
        return axios.get("/files/" + company);
    }

    deleteFilesByCompany(company, file) {
        return axios.delete("/files/" + company + '/' + file);
    }
}

export default new UploadFilesService();