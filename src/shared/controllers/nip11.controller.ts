import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../../src/modules/config/config.service';
import { Nip11DTO } from '../../modules/config/dto/nip11.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('NIP-11')
export class Nip11Controller {
  private CONFIG: Nip11DTO | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initializeConfigListener();
  }

  @Get()
  async handleRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (!this.CONFIG) {
      await this.setConfig();
    }

    const { id, createdAt, updatedAt, url, ...config } = this.CONFIG!;

    if (req.headers['accept'] === 'application/nostr+json') {
      res.json(config);
    }

    res.type('text/html').send(this.generateHtmlResponse(config));
  }

  private async setConfig(): Promise<void> {
    const config = await this.configService.getNip11();
    this.CONFIG = config?.toDto() as Nip11DTO;
  }

  private initializeConfigListener(): void {
    this.configService.on('NIP11-UPDATED', async () => {
      await this.setConfig();
    });
  }

  private generateHtmlResponse(
    config: Omit<Nip11DTO, 'id' | 'createdAt' | 'updatedAt' | 'maxQueryLimit' | 'defaultQueryLimit'>,
  ): string {
    const currentYear = new Date().getFullYear();

    const tableRows = Object.entries(config)
      .map(([key, value]) => {
        const displayValue = typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : value;
        return `
          <tr>
            <td><strong>${key}</strong></td>
            <td>${displayValue}</td>
          </tr>`;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>NIP-11 ${config.name}</title>
          <style>
            body {
              font-family: 'Roboto', Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9fb;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .container {
              background: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              max-width: 800px;
              text-align: center;
              overflow: hidden;
            }
            .logo {
              width: 240px;
              margin: 0 auto 20px;
            }
            h1 {
              font-size: 2rem;
              color: #2c3e50;
              margin-bottom: 20px;
            }
            p {
              font-size: 1rem;
              color: #555;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table th, table td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            table th {
              background-color: #f4f4f9;
              font-weight: bold;
              color: #2c3e50;
            }
            table tr:nth-child(even) {
              background-color: #f9f9fb;
            }
            table tr:hover {
              background-color: #f1f1f1;
            }
            .footer {
              margin-top: 20px;
              font-size: 0.9rem;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="/assets/logo.png" alt="Relay Logo" class="logo" />
            <h1>${config.name}</h1>
            <p>
              This relay supports the Nostr protocol. Use the <code>application/nostr+json</code>
              Accept header to get detailed information about this relay.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            <div class="footer">&copy; ${currentYear} <a href="https://dezh.tech" target="_blank" rel="noopener noreferrer">Dezh Technologies</a>. All rights reserved.</div>
          </div>
        </body>
      </html>`;
  }
}
