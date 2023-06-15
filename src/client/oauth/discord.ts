export const discordSignInUrl = new URL(
	"https://discord.com/api/oauth2/authorize"
);
discordSignInUrl.searchParams.set(
	"client_id",
	import.meta.env.VITE_DISCORD_CLIENT_ID
);
discordSignInUrl.searchParams.set(
	"redirect_uri",
	new URL("/oauth-callback/discord", location.origin).href
);
discordSignInUrl.searchParams.set("response_type", "code");
discordSignInUrl.searchParams.set("scope", "identify guilds");
discordSignInUrl.searchParams.set("prompt", "none");
// TODO: implement state
