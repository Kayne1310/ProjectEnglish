# Use official .NET SDK as build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution and project files first (to leverage Docker caching)
COPY ProjectEnglishFall2025.sln .
COPY ProjectEnglishFall2025/*.csproj ProjectEnglishFall2025/
COPY ProjectEnglishFall2025.Application/*.csproj ProjectEnglishFall2025.Application/
COPY ProjectFall2025.Common/*.csproj ProjectFall2025.Common/
COPY ProjectFall2025.Domain/*.csproj ProjectFall2025.Domain/
COPY ProjectFall2025.Infrastructure/*.csproj ProjectFall2025.Infrastructure/

# Restore dependencies before copying full source code
RUN dotnet restore

# Now copy the rest of the source code
COPY . .

# Build and publish the app
RUN dotnet publish ProjectEnglishFall2025 -c Release -o /out

# Use runtime-only image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["dotnet", "ProjectEnglishFall2025.dll"]
