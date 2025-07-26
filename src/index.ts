import { Hono } from 'hono';

interface QRVerifyRequest {
  qrUrl: string;
}

class AgeVerificationProcessor {
  private baseUrl = 'https://eu-west-1.faceassure.com';
  private userAgent: string;
  private parsedUA: any;
  private location: any;
  private mediaMetadata: any;

  constructor() {
    this.userAgent = this.generateUserAgent();
    this.parsedUA = this.parseUserAgent(this.userAgent);
    this.location = this.getRandomLocation();
    this.mediaMetadata = this.generateMediaMetadata();
  }

  private generateUserAgent(): string {
    const agents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/109.0 Firefox/117.0',
      'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  }

  private parseUserAgent(userAgent: string): any {
    const isIOS = /iPhone|iPad/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);

    return {
      browser: {
        name: isSafari
          ? 'Safari'
          : isChrome
          ? 'Chrome'
          : isFirefox
          ? 'Firefox'
          : 'Safari',
        version: isIOS ? '17.0' : '117.0',
      },
      device: {
        type: 'mobile',
        vendor: isIOS ? 'Apple' : 'Samsung',
        model: isIOS ? 'iPhone' : 'Galaxy',
      },
      os: {
        name: isIOS ? 'iOS' : isAndroid ? 'Android' : 'iOS',
        version: isIOS ? '17.0' : '13',
      },
      engine: { name: isSafari || isIOS ? 'WebKit' : 'Blink' },
      cpu: { architecture: '64' },
    };
  }

  private getRandomLocation() {
    const locations = [
      {
        country: 'United States',
        state: 'California',
        timezone: 'America/Los_Angeles',
        lang: 'en-US,en;q=0.9',
      },
      {
        country: 'United States',
        state: 'New York',
        timezone: 'America/New_York',
        lang: 'en-US,en;q=0.9',
      },
      {
        country: 'Canada',
        state: 'Ontario',
        timezone: 'America/Toronto',
        lang: 'en-CA,en;q=0.9,fr;q=0.8',
      },
      {
        country: 'Australia',
        state: 'New South Wales',
        timezone: 'Australia/Sydney',
        lang: 'en-AU,en;q=0.9',
      },
      {
        country: 'Germany',
        state: 'Berlin',
        timezone: 'Europe/Berlin',
        lang: 'de-DE,de;q=0.9,en;q=0.8',
      },
      {
        country: 'France',
        state: 'Île-de-France',
        timezone: 'Europe/Paris',
        lang: 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      {
        country: 'Netherlands',
        state: 'North Holland',
        timezone: 'Europe/Amsterdam',
        lang: 'nl-NL,nl;q=0.9,en;q=0.8',
      },
      {
        country: 'Sweden',
        state: 'Stockholm',
        timezone: 'Europe/Stockholm',
        lang: 'sv-SE,sv;q=0.9,en;q=0.8',
      },
      {
        country: 'Norway',
        state: 'Oslo',
        timezone: 'Europe/Oslo',
        lang: 'nb-NO,nb;q=0.9,en;q=0.8',
      },
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private generateMediaMetadata() {
    const randomFloat = (min: number, max: number, decimals = 6) =>
      parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    const randomChoice = (arr: any[]) =>
      arr[Math.floor(Math.random() * arr.length)];
    const randomHex = () =>
      Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16)
          .toString(16)
          .toUpperCase()
      ).join('');

    const specs = [
      {
        width: 4032,
        height: 3024,
        frameRate: 60,
        zoom: 10,
        aspectRatio: 4032 / 3024,
      },
      {
        width: 3840,
        height: 2160,
        frameRate: 60,
        zoom: 8,
        aspectRatio: 3840 / 2160,
      },
      {
        width: 1920,
        height: 1080,
        frameRate: 120,
        zoom: 5,
        aspectRatio: 1920 / 1080,
      },
      {
        width: 2560,
        height: 1440,
        frameRate: 60,
        zoom: 6,
        aspectRatio: 2560 / 1440,
      },
    ];

    const spec = randomChoice(specs);
    const deviceId = randomHex();

    return [
      {
        mediaKind: 'audioinput',
        mediaLabel: randomChoice(['', 'Built-in Microphone', 'Default']),
        mediaId: randomHex(),
        mediaCapabilities: {},
      },
      {
        mediaKind: 'videoinput',
        mediaLabel: randomChoice([
          'Front Camera',
          'FaceTime HD Camera',
          'Integrated Camera',
        ]),
        mediaId: deviceId,
        mediaCapabilities: {
          aspectRatio: {
            max: spec.aspectRatio,
            min: randomFloat(0.0003, 0.001, 15),
          },
          backgroundBlur: [false],
          deviceId: deviceId,
          facingMode: ['user'],
          focusDistance: { min: randomFloat(0.1, 0.3) },
          frameRate: { max: spec.frameRate, min: 1 },
          groupId: randomHex(),
          height: { max: spec.height, min: 1 },
          powerEfficient: [false, true],
          whiteBalanceMode: randomChoice([
            ['manual', 'continuous'],
            ['auto', 'manual'],
            ['continuous'],
          ]),
          width: { max: spec.width, min: 1 },
          zoom: { max: spec.zoom, min: 1 },
        },
      },
    ];
  }

  private decodeJWT(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  }

  private extractShortlinkId(qrUrl: string) {
    const url = new URL(qrUrl);
    const sl = url.searchParams.get('sl');
    if (!sl) throw new Error('No shortlink ID found in URL');
    return sl;
  }

  private async getOriginalUrl(shortlinkId: string) {
    const response = await fetch(`${this.baseUrl}/shortlinks/${shortlinkId}`);
    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data.Item.original_url.S;
  }

  private extractJWT(originalUrl: string) {
    const url = new URL(originalUrl.replace('#', '')); // remove fragment if present
    const token = url.searchParams.get('token');
    if (!token) throw new Error('No JWT token found in original URL');
    return token;
  }

  private async generateNewSession(jwt: string, jti: string) {
    const response = await fetch(
      `${this.baseUrl}/age-services/d-privately-age-services`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': this.userAgent,
        },
        body: JSON.stringify({
          request_type: 'generate_new_session',
          transaction_id: jti,
          api_key: null,
          api_secret: null,
          token: jwt,
          longURL: null,
          userAgent: this.userAgent,
        }),
      }
    );
    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  private async completeTransaction(
    sessionData: any,
    jwtPayload: any,
    jwt: string
  ) {
    const randomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const randomFloat = (min: number, max: number, decimals = 15) =>
      parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    const randomHex = (length: number) =>
      Array.from({ length }, () =>
        Math.floor(Math.random() * 16)
          .toString(16)
          .toUpperCase()
      ).join('');

    const generateBoundingBox = () => {
      const topLeft = [randomFloat(140, 160), randomFloat(250, 270)];
      const width = randomFloat(170, 190);
      const height = randomFloat(220, 240);
      return {
        topLeft,
        bottomRight: [topLeft[0] + width, topLeft[1] + height],
        width,
        height,
      };
    };

    const generateTimeline = (maxTime: number) => {
      const entries: [number, number][] = [];
      for (let i = 0; i < randomInt(2, 5); i++) {
        const start = randomInt(1, maxTime - 100);
        const end = start + randomInt(50, 500);
        if (end < maxTime) entries.push([start, end]);
      }
      return entries;
    };

    const generateStateTimelines = (completionTime: number) => {
      const states = [
        'NO_FACE',
        'TURN_RIGHT',
        'ALIGN_YOUR_FACE_WITH_THE_CAMERA_DOWN',
        'CENTRE_FACE',
        'KEEP_YOUR_MOUTH_OPEN',
        'CLOSE_YOUR_MOUTH',
        'LOOK_STRAIGHT',
      ];
      const timelines: any = {};
      states.forEach(
        (state) =>
          (timelines[state] =
            Math.random() > 0.4 ? generateTimeline(completionTime) : [])
      );
      return timelines;
    };

    const baseAge = randomFloat(25.2, 35.0);
    const minAge = baseAge - randomFloat(0.1, 0.5);
    const maxAge = baseAge + randomFloat(0.1, 0.5);
    const averageAge = (minAge + maxAge) / 2;
    const currentTime = Date.now() / 1000;
    const completionTime = randomInt(8000, 15000);

    const payload = {
      request_type: 'complete_transaction',
      transaction_id: sessionData.transaction_id,
      api_key: sessionData.session_id,
      api_secret: sessionData.session_password,
      remote_pld: {},
      browser_response_data: {
        age: 'yes',
        age_confidence: 1,
        genuineness: Array.from({ length: 7 }, () => randomFloat(0.4, 0.98)),
        recordedOpennessStreak: [],
        product: 'age',
        modality: 'image',
        unverifiedPayload: {
          iss: 'https://api.privately.swiss',
          sub: 1024,
          aud: 'https://api.k-id.com',
          exp: jwtPayload.exp,
          nbf: jwtPayload.nbf,
          iat: jwtPayload.iat,
          jti: jwtPayload.jti,
          age: jwtPayload.age,
          liv: true,
          rlt: { minAge, maxAge, score: 0, gate: 16 },
          rsn: 'complete_transaction',
          rtf: 'interval',
          rtb: 'callback',
          vid: jwtPayload.vid,
          ufi: [],
        },
        ageCheckSession: randomHex(40),
        miscellaneous: {
          screenAttackMeasure: 0,
          screenAttackBoundingBox: {},
          subclient: 1024,
          verificationID: jwtPayload.vid,
          version: 'v1.10.1',
          model_version: 'v.2025.0',
          cropper_version: 'v.0.0.3',
          start_time_stamp: currentTime - randomFloat(20, 60),
          end_time_stamp: currentTime,
          device_timezone: this.location.timezone,
          referring_page: `https://d3ogqhtsivkon3.cloudfront.net/?token=${jwt}&shi=false&from_qr_scan=true`,
          parent_page: `https://d3ogqhtsivkon3.cloudfront.net/dynamic_index.html?sl=${jwtPayload.jti}&region=eu-central-1`,
          face_confidence_limit: 0.975,
          multipleFacesDetected: false,
          targetGate: 18,
          targetConfidence: 0.9,
          averageAge,
          selecedLivenessStyle: 'open',
          selectedMediaLabel: 'Front Camera',
          rawImageWidth: 480,
          rawImageHeight: 640,
          boundingBoxesInPixels: Array.from(
            { length: randomInt(5, 10) },
            generateBoundingBox
          ),
          diagnosticDataURLs: [],
          latestReportedState: 'AGE_CHECK_COMPLETE',
          authenticationCharacteristics: {
            session_id: sessionData.session_id,
            session_password: sessionData.session_password,
            token: jwt,
          },
          deviceCharacteristics: {
            deviceBrowserModel: this.userAgent,
            isMobile: this.parsedUA.device.type === 'mobile',
            browserName: this.parsedUA.browser.name?.toLowerCase() || 'safari',
            isDeviceBrowserCompatible: true,
            deviceConnectionSpeedKbps: randomFloat(20000, 500000),
            deviceRegion: {
              country: this.location.country,
              state: this.location.state,
            },
            mediaMetadata: this.mediaMetadata,
            platformDetails: {
              name: this.parsedUA.browser.name || 'Safari',
              version: this.parsedUA.browser.version || '15.0',
              layout: this.parsedUA.engine.name || 'WebKit',
              os: {
                architecture: parseInt(this.parsedUA.cpu.architecture) || 64,
                family: this.parsedUA.os.name || 'iOS',
                version: this.parsedUA.os.version || '15.0',
              },
              description: `${this.parsedUA.browser.name || 'Safari'} ${
                this.parsedUA.browser.version || '15.0'
              } on ${this.parsedUA.device.vendor || 'Apple'} ${
                this.parsedUA.device.model || 'iPhone'
              } (${this.parsedUA.os.name || 'iOS'} ${
                this.parsedUA.os.version || '15.0'
              })`,
              product: this.parsedUA.device.model || 'iPhone',
              manufacturer: this.parsedUA.device.vendor || 'Apple',
            },
          },
          initializationCharacteristics: {
            cropperInitTime: randomInt(150, 250),
            coreInitTime: randomInt(800, 1000),
            pageLoadTime: randomInt(250, 350),
            from_qr_scan: 'true',
            blendShapesAvailable: true,
          },
          executionCharacteristics: {
            isCameraPermissionGranted: true,
            completionTime,
            initialAdjustmentTime: randomInt(10000, 14000),
            completionState: 'COMPLETE',
            unfinishedInstructions: Object.fromEntries(
              [
                'NO_FACE',
                'VIDEO_PROCESSING',
                'STAY_STILL',
                'LOOK_STRAIGHT',
                'GET_READY',
                'TURN_LEFT',
                'TURN_RIGHT',
                'ALIGN_YOUR_FACE_WITH_THE_CAMERA_UP',
                'ALIGN_YOUR_FACE_WITH_THE_CAMERA_DOWN',
                'SLIGHTLY_TILT_YOUR_HEAD_LEFT',
                'SLIGHTLY_TILT_YOUR_HEAD_RIGHT',
                'CENTRE_FACE',
                'OPEN_YOUR_MOUTH',
                'KEEP_YOUR_MOUTH_OPEN',
                'CLOSE_YOUR_MOUTH',
                'SLOWLY_COME_CLOSER_TO_THE_CAMERA',
                'SLOWLY_DISTANCE_YOURSELF_FROM_THE_CAMERA',
                'TOO_DARK',
              ].map((k) => [k, false])
            ),
            stateCompletionTimes: {
              TIME_UNTIL_CLICK_START: randomInt(800, 3200),
              GET_READY: randomInt(1200, 4000),
              NO_FACE: randomInt(2000, 5500),
              SLOWLY_COME_CLOSER_TO_THE_CAMERA: randomInt(800, 3500),
              TURN_RIGHT: randomInt(3000, 8500),
              ALIGN_YOUR_FACE_WITH_THE_CAMERA_UP: randomInt(500, 2800),
              CLOSE_YOUR_MOUTH: randomInt(1800, 5200),
              ALIGN_YOUR_FACE_WITH_THE_CAMERA_DOWN: randomInt(2500, 7500),
              CENTRE_FACE: randomInt(8000, 18000),
              LOOK_STRAIGHT: randomInt(100, 800),
              KEEP_YOUR_MOUTH_OPEN: randomInt(3500, 9000),
            },
            stateTimelines: generateStateTimelines(completionTime),
            nonNeutralExpressionTimelines: Object.fromEntries(
              [
                'browDownLeft',
                'browDownRight',
                'mouthSmileLeft',
                'mouthSmileRight',
                'mouthPucker',
                'mouthDimpleLeft',
                'mouthDimpleRight',
                'mouthPressLeft',
                'mouthPressRight',
                'mouthShrugLower',
                'mouthShrugUpper',
                'eyeBlinkLeft',
                'eyeBlinkRight',
                'mouthFrownLeft',
                'mouthFrownRight',
              ].map((k) => [k, {}])
            ),
            predictions: {
              outputs: Array.from({ length: 9 }, () =>
                randomFloat(minAge, maxAge)
              ),
              raws: Array.from({ length: 10 }, () => randomFloat(5.1, 6.4)),
              age: 'yes',
              horizontal_estimates: Array.from({ length: 6 }, () =>
                randomFloat(3.1, 3.2)
              ),
              vertical_estimates: Array.from({ length: 6 }, () =>
                randomFloat(-1.6, -1.5)
              ),
              horizontalratiotocenter_estimates: Array.from({ length: 6 }, () =>
                randomFloat(1.01, 1.03)
              ),
              zy_estimates: Array.from({ length: 6 }, () =>
                randomFloat(0.42, 0.44)
              ),
              driftfromcenterx_estimates: Array.from({ length: 6 }, () =>
                randomFloat(0.005, 0.007)
              ),
              driftfromcentery_estimates: Array.from({ length: 6 }, () =>
                randomFloat(-0.35, -0.37)
              ),
              xScaledShiftAmt: randomFloat(11.0, 12.0),
              yScaledShiftAmt: randomFloat(-2.5, -1.5),
            },
          },
          errorCharacteristics: { systemErrors: [], userErrors: {} },
        },
      },
    };

    const response = await fetch(
      `${this.baseUrl}/age-services/d-privately-age-services`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': this.userAgent,
          accept: '*/*',
          'accept-language': this.location.lang,
          'access-control-allow-origin': '*',
          priority: 'u=1, i',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  async processQRUrl(qrUrl: string) {
    const shortlinkId = this.extractShortlinkId(qrUrl);
    const originalUrl = await this.getOriginalUrl(shortlinkId);
    const jwt = this.extractJWT(originalUrl);
    const jwtPayload = this.decodeJWT(jwt);
    const sessionData = await this.generateNewSession(jwt, jwtPayload.jti);
    return await this.completeTransaction(sessionData, jwtPayload, jwt);
  }
}

const app = new Hono();

const processor = new AgeVerificationProcessor();

app.post('/verify', async (c) => {
  try {
    const body: QRVerifyRequest = await c.req.json();

    if (!body.qrUrl) {
      return c.json({ success: false, error: 'QR URL is required' }, 400);
    }

    if (!body.qrUrl.includes('?sl=')) {
      return c.json(
        {
          success: false,
          error: 'Invalid QR Code format. Must contain shortlink parameter.',
        },
        400
      );
    }

    const result = await processor.processQRUrl(body.qrUrl);

    return c.json({ success: true, transaction_id: result.transaction_id });
  } catch (error: any) {
    console.error('Verification error:', error);
    return c.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      500
    );
  }
});

app.get('/health', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() })
);

export default app;
