
#include <opencv2/opencv.hpp>
#include <nlohmann/json.hpp>
#include <stdexcept>

#include "utils.hpp"
#include "node_processor.hpp"
#include "plugin_interface.hpp"

// NodeProcessor::NodeProcessor(PluginManager &pluginManager) : pluginManager_(pluginManager) {}

/**
 * @brief Default constructor that throws an exception.
 *
 * This constructor is not supported. Use the one with PluginManager instead.
 */
NodeProcessor::NodeProcessor() : pluginManager_(*static_cast<PluginManager *>(nullptr)) {}

NodeProcessor::~NodeProcessor() {}
cv::Mat NodeProcessor::process(const nlohmann::json &graph, const std::string &inputPath)
{
    cv::Mat inputImage = cv::imread(inputPath);
    cv::Mat outputImage;

    if (inputImage.empty())
    {
        throw std::runtime_error("Failed to load input image: " + inputPath);
    }

    for (const auto &node : graph)
    {
        const std::string label = node["label"];
        const nlohmann::json params = node["params"];
        const std::string type = node["type"];
        const std::string libPath = getLibraryPath(type);

        PluginManager pluginManager_(libPath);

        auto processFrame =
            reinterpret_cast<PluginResult (*)(const unsigned char *, int, int, int)>(pluginManager_.getFunction("processFrame"));

        if (!processFrame)
        {
            throw std::runtime_error("Failed to load plugin: " + libPath);
        }

        PluginResult result = processFrame(outputImage.data,
                                           outputImage.cols,
                                           outputImage.rows,
                                           outputImage.channels());

        if (result.hasData && result.data)
        {
            cv::Mat processedFrame(result.height,
                                   result.width,
                                   CV_8UC(result.channels),
                                   result.data);

            outputImage = processedFrame.clone();
            free(result.data);
        }
    }

    return outputImage;
}
