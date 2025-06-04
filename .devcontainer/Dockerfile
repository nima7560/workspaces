FROM mcr.microsoft.com/devcontainers/base:jammy

# Update the OS
RUN apt-get update

# Install the ping command
RUN apt-get -y install --no-install-recommends iputils-ping

# Install Go
RUN apt install -y golang-go

# Install Java
RUN apt install -y default-jdk

# Install Python
RUN apt install -y python3

# Install Node.js 18 and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Download the script for HLF and make it executable
RUN curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && \
    chmod +x install-fabric.sh
