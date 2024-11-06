import { fetchToursActivities } from "../apicalls/fetchToursActivities";
import { useQuery } from "@tanstack/react-query";

export const useToursActivitiesQuery = (geoLocation) => {
    return useQuery({
        queryKey: ["toursActivities", geoLocation],
        queryFn: async ({queryKey}) => {
            const [, geoLocation] = queryKey;
            const response = await fetchToursActivities(geoLocation);
            return response;
        },
    });
}

// export default userToursActivitiesQuery;