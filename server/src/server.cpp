#include <nlohmann/json.hpp>
#include <fstream>
#include <opencv2/opencv.hpp>

#include "server.hpp"
#include "node_processor.hpp"

Server::Server(const std::string &host, int port)
    : host_(host), port_(port)
{
    server_ = std::make_unique<httplib::Server>();
}

void Server::start()
{
    this->server_->Options(".*", [](const httplib::Request &req, httplib::Response &res)
                           {
                               res.set_header("Access-Control-Allow-Origin", "*");
                               res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                               res.set_header("Access-Control-Allow-Headers", "Content-Type");
                               res.status = 204; // No Content
                           });

    this->server_->Get("/api/version", [](const httplib::Request &req, httplib::Response &res)
                       {
        nlohmann::json json_response;
        json_response["version"] = "1.0.0";
        res.set_content(json_response.dump(), "application/json"); });

    this->server_->Get("/api/health", [](const httplib::Request &req, httplib::Response &res)
                       {
        nlohmann::json json_response;
        json_response["status"] = "ok";
        res.set_content(json_response.dump(), "application/json"); });

    this->server_->Post("/api/process", [](const httplib::Request &req, httplib::Response &res)
                        {

                            res.set_header("Access-Control-Allow-Origin", "*");
                            res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                            res.set_header("Access-Control-Allow-Headers", "Content-Type");
        try
        {
            if (!req.has_file("file") || !req.has_file("graph"))
            {
                res.status = 400;
                res.set_content("Missing file or graph", "text/plain");
                return;
            }

            const httplib::MultipartFormData &file = req.get_file_value("file");

            std::string inputPath = "server/temp/" + file.filename;
            std::ofstream ofs(inputPath, std::ios::binary);
            ofs.write(file.content.c_str(), file.content.size());
            ofs.close();

            std::cout << "Input file saved to: " << inputPath << std::endl;

            // Load the graph
            // Assuming the graph is in JSON format
            const httplib::MultipartFormData &graphFile = req.get_file_value("graph");
            nlohmann::json graph = nlohmann::json::parse(graphFile.content);

            std::cout << "Graph loaded: " << graph.dump() << std::endl;

            /*
            [   
                {
                    "label":"Depth Estimation",
                    "params":{
                        "model":"MiDaS Large"
                    },
                    "type":"depth_estimation"
                },
                {
                    "label":"Sobel Filter",
                    "params":{
                        "ksize":8
                    },
                    "type":"sobel_filter"
                }
            ]
            */

            // send this graph to the processor 
            NodeProcessor *processor = new NodeProcessor();
            cv::Mat result = processor->process(graph, inputPath);

            // Save result to temporary file
            std::string outputPath = "server/temp/output_" + file.filename;

            cv::imwrite(outputPath, result);

            std::cout << "Output file saved to: " << outputPath << std::endl;

            // Read and return result
            std::ifstream ifs(outputPath, std::ios::binary);
            std::string content((std::istreambuf_iterator<char>(ifs)), std::istreambuf_iterator<char>());
            res.set_content(content, "application/octet-stream");
            res.status = 200;

            // Clean up
            std::filesystem::remove(inputPath);
            std::filesystem::remove(outputPath);
            
            std::cout << "Temporary files cleaned up." << std::endl;
            delete processor;
        }
        catch (const std::exception &e)
        {
            std::cout << "Error: (server.cpp: 113) " << e.what() << std::endl;
            // Handle error
            // Set response status and content
            res.status = 500;
            res.set_content("Error: " + std::string(e.what()), "text/plain");
        } });

    std::cout << "Server running at http://" << host_ << ":" << port_ << std::endl;
    server_->listen(host_.c_str(), port_);
}