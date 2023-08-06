import { getState, getStateActions } from "src/state";
import Axios from "axios";
import { getConfig } from "src/utils/config/get-config";
import { CompactPost } from "src/models/post";
import { CompactTag } from "src/models/tag";
import { CompactAccount } from "src/models/account";
import { LandingPageState } from "./state";

export const fetchPostsForLandingPage = async (): Promise<void> => {
  const { landingPage, postEntities, tagEntities, accountEntities } = getStateActions();
  const { posts, query } = getState().landingPage;
  if (posts === "ERROR") landingPage.set({ posts: null });

  try {
    const endpoint = query.trim().length >= 3 ? `/search/posts?query=${query}` : "/posts/feed";
    // @TODO-ZM: auto-generate types for API endpoints
    const { data } = await Axios.get<{
      posts: CompactPost[];
      tags: CompactTag[];
      posters: CompactAccount[];
    }>(getConfig().api.base_url + endpoint);

    const posts: LandingPageState["posts"] = data.posts.map((post) => {
      const { tag_ids, poster_id, ...lonePost } = post;

      const tags = data.tags.filter((tag) => tag_ids.includes(tag.id));
      if (tags.length !== tag_ids.length)
        throw new Error(
          `Not all tags found for post ${post.id}: looking for ${tag_ids} but found ${tags.map(
            (tag) => tag.id
          )}}`
        );

      const poster = data.posters.find((poster) => poster.id === poster_id);
      if (!poster) throw new Error(`Poster with id ${poster_id} not found for post ${post.id}`);

      return {
        ...lonePost,
        tags,
        poster,
      };
    });

    landingPage.set({ posts });

    // update cache:
    postEntities.upsertMany(data.posts);
    tagEntities.upsertMany(data.tags);
    accountEntities.upsertMany(data.posters);
  } catch (error) {
    landingPage.set({ posts: "ERROR" });
    // @TODO-ZM: use Logger abstraction instead of console.log
    console.log("Error fetching posts for landing page", error);
    // Sentry.captureException(error, { tags: { type: "WEB_FETCH" } });
  }
};

export const fetchPostCountForLandingPage = async (): Promise<void> => {
  const { landingPage } = getStateActions();
  try {
    const { data } = await Axios.get<{ count: number }>(getConfig().api.base_url + "/posts/count");
    landingPage.set({ total_post_count: data.count });
  } catch (error) {
    // @TODO-ZM: use Logger abstraction instead of console.log
    console.log("Error fetching post count for landing page", error);
    // Sentry.captureException(error, { tags: { type: "WEB_FETCH" } });
  }
};
