import axios from "axios";

export class Services {
    private static urlApi = "http://127.0.0.1:5050/api/";

    public static async analyzeImage(image: string,filename:string): Promise<any> {
        let data:any = {}
        data["imageBase64"] = image;
        data["filename"] = filename;

        const response = await axios.post(this.urlApi+"analyzeImage", data, {
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

    public static async sendFeedback(obj: any): Promise<any> {

        const response = await axios.post(this.urlApi+"saveFeedback", obj, {
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
