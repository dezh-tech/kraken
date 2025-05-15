<p align="center">
<img src="./assets/logo.png" width=300 height=300/>
</p>

<h1 align="center">
Kraken
</h1>
<br>

**Kraken** is a management service built with [NestJS](https://nestjs.com/) to handle and configure instances of the **Immortal** Nostr relay. Kraken offers a centralized approach to manage the lifecycle, settings, and configurations of one or more Immortal relay instances, making it an ideal tool for high-demand relays like paid or large community relays.

## Features of Kraken

- **Instance Management**: Easily deploy, start, stop, and monitor Immortal instances.
- **Centralized Configuration**: Manage settings and configurations for multiple instances from a single point.
- **Scalability Support**: Ideal for setups with multiple relays catering to high traffic and community-driven environments.
- **Monitoring**: Integration options for tracking relay performance and usage metrics.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kraken
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment variables required by Kraken. Refer to the `.env.example` file for necessary configuration details.

## Usage

To start the Kraken service:

```bash
npm run start
```

The API and management interface will be available at the configured port. Visit the API documentation for details on available endpoints and request formats.

## Contributing

Contributions are welcome! Please submit issues, bug reports, or pull requests to improve Kraken.

## Donation

Donations and financial support for the development process are possible using Bitcoin and Lightning:

**on-chain**:

```
bc1qfw30k9ztahppatweycnll05rzmrn6u07slehmc
```

**lightning**: 

```
donate@dezh.tech
```

## License

This software is published under the [MIT License](./LICENSE).
