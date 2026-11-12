import { McpServer } from '@modelcontextprotocol/server';
import { createMcpHandler } from 'agents/mcp/server';
import { z } from 'zod';

const SITE = 'https://omnicreator.art';
const SUPPORT = 'support@omnicreator.art';

/** Public pages copied from https://omnicreator.art/llms.txt */
const PAGES: { path: string; title: string; summary: string }[] = [
  {
    path: '/',
    title: 'AI Photo Editor Online',
    summary:
      'Omni Creator is an AI Photo Editor Online free to try. Sign in, check in for +10 credits daily, and edit photos by typing.',
  },
  {
    path: '/use-cases/background-replace',
    title: 'Replace a photo background',
    summary:
      'Upload a photo, write what the new background should be — “clean white studio”, “sunlit café”, “solid #F4E9DA” — and Omni Creator rebuilds the scene behind your subject. No selection tools, masks or layers.',
  },
  {
    path: '/use-cases/object-removal',
    title: 'Remove unwanted objects',
    summary:
      'Name what should disappear — “the person on the left”, “the power lines”, “the trash can by the door” — and Omni Creator removes it and fills the gap with background that matches the rest of the picture.',
  },
  {
    path: '/use-cases/product-photo',
    title: 'Product photos',
    summary:
      'Photograph the product anywhere, then describe the shot you need — white studio, marble counter, soft shadow, top-down flat lay. Omni Creator rebuilds the setting and lighting around your item.',
  },
  {
    path: '/use-cases/fashion-edit',
    title: 'Change an outfit',
    summary:
      'Describe the garment — “a navy wool overcoat”, “the same shirt in olive green”, “a white linen summer dress” — and Omni Creator redraws the clothing while keeping the person’s pose, face and the scene.',
  },
  {
    path: '/use-cases/photo-relighting',
    title: 'Relight a photo',
    summary:
      'Describe the light — “warm golden-hour sun from the left”, “soft window light”, “dramatic studio rim light” — and Omni Creator re-renders the lighting while keeping the subject and composition.',
  },
  {
    path: '/use-cases/text-to-image',
    title: 'Text to image',
    summary:
      'No photo to start from? Describe the picture — subject, setting, style, light — and Omni Creator generates it.',
  },
  {
    path: '/image-upscale',
    title: 'Image upscale',
    summary:
      'The image is re-rendered by an AI image model at the target size, keeping the original composition, colors and subjects while adding sharper detail.',
  },
  {
    path: '/virtual-try-on',
    title: 'Virtual try-on',
    summary:
      'Upload a photo of a person and a garment reference. The AI dresses the person in the garment while keeping their identity, pose and background.',
  },
  {
    path: '/dual-image-edit',
    title: 'Dual-image edit',
    summary:
      'Combine a source image with a reference image: transfer style, place a subject into a new scene, or blend both naturally — guided by your prompt.',
  },
  {
    path: '/pricing',
    title: 'Pricing',
    summary:
      'Monthly subscriptions, yearly subscriptions, and one-time credit packs are available on the pricing page, with payments processed by Waffo.',
  },
];

const EXTRA_PATHS = new Set([
  '/llms.txt',
  '/llms-full.txt',
  '/blog/replace-photo-background-with-ai',
  '/blog/remove-unwanted-objects-from-photos',
  '/blog/ai-product-photos-for-ecommerce',
  '/blog/relight-photos-with-ai',
  '/blog/ai-image-editing-prompts',
  '/blog/text-to-image-vs-image-editing',
]);

const PAGE_PATHS = new Set(PAGES.map((page) => page.path).concat([...EXTRA_PATHS]));

const OVERVIEW = {
  website: SITE,
  support: SUPPORT,
  title: 'AI Photo Editor Online',
  summary:
    'Omni Creator is an AI Photo Editor Online free to try. Sign in, check in for +10 credits daily, and edit photos by typing.',
  facts: [
    'New accounts signing in with Google receive 20 free credits, plus +10 credits for daily check-in.',
    'Credits are only deducted when the result is ready; failed tasks are free.',
    'JPG, PNG, WebP, AVIF, HEIC and HEIF up to 25 MB. HEIC/AVIF are converted in your browser and photos are auto-resized (min side ≥ 384 px, long edge ≤ 1536 px) before upload. BMP is not supported.',
    'Browse freely. Generating requires Google sign-in.',
    'Checkout is not live. Use daily check-in credits today; packs will be announced when payments open.',
    'Do not upload content you lack rights to use, create non-consensual intimate imagery, or use Omni Creator for fraud or illegal activity. Obvious NSFW prompts are blocked.',
    'It has no layers, masks or manual retouching tools.',
    'Each upscale costs 30 credits across 1K, 2K, and 4K, and credits are deducted only when generation succeeds. Free users can upscale to 1K low quality; 2K and 4K require an active paid plan.',
    'Virtual try-on: 30 credits per result, charged only when the image is ready. Failed tasks are free.',
    'Dual-image edit: 30 credits per result, charged only when the image is ready. Failed tasks are free.',
  ],
  pages: PAGES.map((page) => ({
    url: `${SITE}${page.path === '/' ? '/' : page.path}`,
    title: page.title,
    summary: page.summary,
  })),
  llms: `${SITE}/llms.txt`,
  llmsFull: `${SITE}/llms-full.txt`,
};

const MAX_PAGE_CHARS = 24_000;

function normalizePath(raw: string): string | null {
  let path = raw.trim();
  if (!path) return null;
  if (!path.startsWith('/')) path = `/${path}`;
  try {
    const url = new URL(path, SITE);
    if (url.origin !== SITE) return null;
    path = url.pathname;
  } catch {
    return null;
  }
  const locale = path.match(/^\/(zh|ja|ko)(?=\/|$)/);
  if (locale) {
    path = path.slice(locale[0].length) || '/';
  }
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return PAGE_PATHS.has(path) ? path : null;
}

function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

function createServer() {
  const server = new McpServer({
    name: 'omnicreator',
    version: '1.0.0',
  });

  server.registerTool(
    'get_overview',
    {
      title: 'Omni Creator overview',
      description:
        'Return public Omni Creator facts, credit rules, file types, and page URLs from https://omnicreator.art. Read-only. Does not generate images or read accounts.',
      inputSchema: z.object({}),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => textResult(JSON.stringify(OVERVIEW, null, 2)),
  );

  server.registerTool(
    'list_pages',
    {
      title: 'List Omni Creator public pages',
      description:
        'List public Omni Creator pages with titles, summaries, and https://omnicreator.art URLs from the live llms.txt directory.',
      inputSchema: z.object({}),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () =>
      textResult(
        JSON.stringify(
          PAGES.map((page) => ({
            url: `${SITE}${page.path === '/' ? '/' : page.path}`,
            title: page.title,
            summary: page.summary,
          })),
          null,
          2,
        ),
      ),
  );

  server.registerTool(
    'fetch_public_page',
    {
      title: 'Fetch an Omni Creator public page',
      description:
        'Fetch a public Omni Creator page as markdown (or llms.txt as plain text). Allowed paths are the live directory pages. Does not call login or generation APIs.',
      inputSchema: z.object({
        path: z
          .string()
          .describe(
            'Public path such as /, /pricing, /use-cases/background-replace, /image-upscale, /llms.txt, or /llms-full.txt',
          ),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ path }) => {
      const allowed = normalizePath(path);
      if (!allowed) {
        return textResult(
          JSON.stringify({
            error: 'Path is not a public Omni Creator page.',
            website: SITE,
            allowed: [...PAGE_PATHS],
          }),
        );
      }
      const url = `${SITE}${allowed === '/' ? '/' : allowed}`;
      const accept = allowed.startsWith('/llms')
        ? 'text/plain, text/markdown;q=0.8'
        : 'text/markdown, text/plain;q=0.8';
      const response = await fetch(url, {
        headers: { Accept: accept, 'User-Agent': 'omnicreator-mcp/1.0' },
        redirect: 'follow',
      });
      const body = await response.text();
      const clipped =
        body.length > MAX_PAGE_CHARS
          ? `${body.slice(0, MAX_PAGE_CHARS)}\n\n[truncated]`
          : body;
      return textResult(
        JSON.stringify({
          url,
          status: response.status,
          contentType: response.headers.get('content-type'),
          body: clipped,
        }),
      );
    },
  );

  return server;
}

const mcpHandler = createMcpHandler(createServer, {
  route: '/mcp',
  allowedHostnames: [
    'omnicreator.art',
    'www.omnicreator.art',
    'omnicreator-mcp.tian-wei.workers.dev',
  ],
  allowedOriginHostnames: '*',
});

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
      return new Response(
        [
          'Omni Creator MCP',
          'Website: https://omnicreator.art/',
          'MCP endpoint: /mcp (Streamable HTTP)',
          'Support: support@omnicreator.art',
        ].join('\n'),
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      );
    }
    return mcpHandler(request, env, ctx);
  },
};
