#include <nlohmann/json.hpp>
#include <fstream>
#include <opencv2/opencv.hpp>

#include "server.hpp"

Server::Server(const std::string &host, int port)
    : host_(host), port_(port)
{
    server_ = std::make_unique<httplib::Server>();
}

void Server::start()
{

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

    this->server_->Post("/api/pipeline", [](const httplib::Request &req, httplib::Response &res)
                        {
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

            const httplib::MultipartFormData &graphFile = req.get_file_value("graph");
            nlohmann::json graph = nlohmann::json::parse(graphFile.content);

            // Process the pipeline
            cv::Mat result; // = processor_.process(graph, inputPath);

            // Save result to temporary file
            std::string outputPath = "server/temp/output_" + file.filename;
            if (inputPath.find(".mp4"))
            {
                // For simplicity, save as image (extend for video if needed)
                cv::imwrite(outputPath, result);
            }
            else
            {
                cv::imwrite(outputPath, result);
            }

            // Read and return result
            std::ifstream ifs(outputPath, std::ios::binary);
            std::string content((std::istreambuf_iterator<char>(ifs)), std::istreambuf_iterator<char>());
            res.set_content(content, "application/octet-stream");

            // Clean up
            std::filesystem::remove(inputPath);
            std::filesystem::remove(outputPath);
        }
        catch (const std::exception &e)
        {
            res.status = 500;
            res.set_content("Error: " + std::string(e.what()), "text/plain");
        } });

    std::cout << "Server running at http://" << host_ << ":" << port_ << std::endl;
    server_->listen(host_.c_str(), port_);
}