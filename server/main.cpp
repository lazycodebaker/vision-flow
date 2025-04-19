#include <iostream>

#include "server.hpp"

int main()
{
    std::cout << "Running : Vision Flow Canvas Server" << std::endl;

    Server server("localhost", 8080);
    server.start();

    return EXIT_SUCCESS;
}