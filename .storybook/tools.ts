const url = import.meta.env.STORYBOOK_STASH_SERVER;

export const getStashContent = (link: string) => url + link;
