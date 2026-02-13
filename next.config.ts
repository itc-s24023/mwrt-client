import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

    headers() {
        return [
            {
                source: "/",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type",
                    }
                ]
            }
        ]
    }
};

export default nextConfig;
