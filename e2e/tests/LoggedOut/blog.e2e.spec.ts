import { Page, expect, test } from '@playwright/test';
import { PageModel } from '../PageModel';
import * as Helpers from '../helpers';
import contentfulBlogPosts from '../../mocks/contentful_blog_posts.json';

test.describe('Blog', () => {
    let page: Page = null;
    let skip = 0;
    let limit = 0;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();

        await page.route('https://cdn.contentful.com/spaces/*/*/*/entries?*', async (route) => {
            const reqUrl = new URL(route.request().url());
            const searchParams = reqUrl.searchParams;
            skip = Number(searchParams.get('skip'));
            limit = Number(searchParams.get('limit'));

            const json = {
                items: contentfulBlogPosts.slice(skip, skip + limit),
                limit,
                skip,
                sys: { type: 'Array' },
                total: contentfulBlogPosts.length
            };
            await route.fulfill({ json });
        });
    });

    test('Blogs are paginated', async () => {
        // Navigate to blog page
        await page.goto(`${Helpers.UI_BASE}/blog`);

        // check page title and description
        await expect(page.locator(PageModel.blog.pageTitle)).toBeVisible();
        await expect(page.locator(PageModel.blog.pageDescription)).toBeVisible();
        await expect(page.locator(PageModel.blog.followOnTwitter)).toBeVisible();

        // check that blog cards are visible
        await expect(page.locator(PageModel.blog.blogCard).first()).toBeVisible();

        // check the number of blog cards displayed per page equals "limit" query param used for the api call
        expect(await page.locator(PageModel.blog.blogCard).count()).toEqual(limit);

        // check pagination info shows correct details
        expect(await page.locator(PageModel.blog.paginationInfo).textContent()).toEqual(
            `Showing 1 - ${limit} of ${contentfulBlogPosts.length}`
        );

        // check next/prev buttons
        await expect(page.locator(PageModel.blog.prevButton)).toBeDisabled();
        await expect(page.locator(PageModel.blog.nextButton)).toBeEnabled();

        // clicking the Next button goes to second page
        await page.click(PageModel.blog.nextButton);

        // check the rest of blog posts are displayed
        expect(await page.locator(PageModel.blog.blogCard).count()).toEqual(contentfulBlogPosts.length - skip);

        // check pagination info shows correct details for the second page
        expect(await page.locator(PageModel.blog.paginationInfo).textContent()).toEqual(
            `Showing ${skip + 1} - ${
                skip + limit > contentfulBlogPosts.length ? contentfulBlogPosts.length : skip + limit
            } of ${contentfulBlogPosts.length}`
        );

        // check next/prev buttons
        await expect(page.locator(PageModel.blog.prevButton)).toBeEnabled();
        await expect(page.locator(PageModel.blog.nextButton)).toBeDisabled();
    });
});
