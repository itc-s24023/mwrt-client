import { API } from "@/libs/api/api";
import { Screen } from "./_screen/screen";

export default async function Home() {

    const categories = await API.API_Request_Category();
    
    return (
        <Screen/>
    );
}
