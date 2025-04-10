import axios from "axios";

export class Services {
    private static urlApi = "http://127.0.0.1:5050/api/analyzeImage";

    public static async analyzeImage(image: string,filename:string): Promise<any> {
        let data:any = {}
        data["imageBase64"] = image;
        data["filename"] = filename;

        const response = await axios.post(this.urlApi, data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.status) {
            throw new Error("Network response was not ok");
        }      
        return await response.data;
    }
}
