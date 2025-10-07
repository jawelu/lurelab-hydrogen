// import type {Route} from './+types/$';

// export async function loader({request}: Route.LoaderArgs) {
//   throw new Response(`${new URL(request.url).pathname} not found`, {
//     status: 404,
//   });
// }

// export default function CatchAllPage() {
//   return null;
// }


// app/routes/$.tsx
// app/routes/$.tsx
import type { Route } from "./+types/$";

// GET 请求：返回 404
export async function loader({ request }: Route.LoaderArgs) {
  return new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

// POST / PUT / DELETE：处理提交
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  console.log("Catch-all action received form:", data);

  // 直接返回 JSON Response
  return Response.json({ ok: true, received: data });
}

export default function CatchAllPage() {
  return null;
}
