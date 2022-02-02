"use strict";
(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 537:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getStaticProps": () => (/* binding */ getStaticProps),
/* harmony export */   "getStaticPaths": () => (/* binding */ getStaticPaths),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps),
/* harmony export */   "unstable_getStaticParams": () => (/* binding */ unstable_getStaticParams),
/* harmony export */   "unstable_getStaticProps": () => (/* binding */ unstable_getStaticProps),
/* harmony export */   "unstable_getStaticPaths": () => (/* binding */ unstable_getStaticPaths),
/* harmony export */   "unstable_getServerProps": () => (/* binding */ unstable_getServerProps),
/* harmony export */   "config": () => (/* binding */ config),
/* harmony export */   "_app": () => (/* binding */ _app),
/* harmony export */   "renderReqToHTML": () => (/* binding */ renderReqToHTML),
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var next_dist_server_node_polyfill_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(607);
/* harmony import */ var next_dist_server_node_polyfill_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_node_polyfill_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9450);
/* harmony import */ var private_dot_next_build_manifest_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7020);
/* harmony import */ var private_dot_next_react_loadable_manifest_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3978);
/* harmony import */ var next_dist_build_webpack_loaders_next_serverless_loader_page_handler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9436);

      
      
      
      

      
      const { processEnv } = __webpack_require__(2333)
      processEnv([])
    
      
      const runtimeConfig = {}
      ;

      const documentModule = __webpack_require__(5641)

      const appMod = __webpack_require__(2957)
      let App = appMod.default || appMod.then && appMod.then(mod => mod.default);

      const compMod = __webpack_require__(441)

      const Component = compMod.default || compMod.then && compMod.then(mod => mod.default)
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component);
      const getStaticProps = compMod['getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['getStaticProp' + 's'])
      const getStaticPaths = compMod['getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['getStaticPath' + 's'])
      const getServerSideProps = compMod['getServerSideProp' + 's'] || compMod.then && compMod.then(mod => mod['getServerSideProp' + 's'])

      // kept for detecting legacy exports
      const unstable_getStaticParams = compMod['unstable_getStaticParam' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticParam' + 's'])
      const unstable_getStaticProps = compMod['unstable_getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticProp' + 's'])
      const unstable_getStaticPaths = compMod['unstable_getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticPath' + 's'])
      const unstable_getServerProps = compMod['unstable_getServerProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getServerProp' + 's'])

      let config = compMod['confi' + 'g'] || (compMod.then && compMod.then(mod => mod['confi' + 'g'])) || {}
      const _app = App

      const combinedRewrites = Array.isArray(private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites */ .Dg)
        ? private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites */ .Dg
        : []

      if (!Array.isArray(private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites */ .Dg)) {
        combinedRewrites.push(...private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites.beforeFiles */ .Dg.beforeFiles)
        combinedRewrites.push(...private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites.afterFiles */ .Dg.afterFiles)
        combinedRewrites.push(...private_dot_next_routes_manifest_json__WEBPACK_IMPORTED_MODULE_1__/* .rewrites.fallback */ .Dg.fallback)
      }

      const { renderReqToHTML, render } = (0,next_dist_build_webpack_loaders_next_serverless_loader_page_handler__WEBPACK_IMPORTED_MODULE_4__/* .getPageHandler */ .u)({
        pageModule: compMod,
        pageComponent: Component,
        pageConfig: config,
        appModule: App,
        documentModule: documentModule,
        errorModule: __webpack_require__(9185),
        notFoundModule: __webpack_require__(9622),
        pageGetStaticProps: getStaticProps,
        pageGetStaticPaths: getStaticPaths,
        pageGetServerSideProps: getServerSideProps,

        assetPrefix: "",
        canonicalBase: "",
        generateEtags: true,
        poweredByHeader: true,

        runtimeConfig,
        buildManifest: private_dot_next_build_manifest_json__WEBPACK_IMPORTED_MODULE_2__,
        reactLoadableManifest: private_dot_next_react_loadable_manifest_json__WEBPACK_IMPORTED_MODULE_3__,

        rewrites: combinedRewrites,
        i18n: undefined,
        page: "/",
        buildId: "r1IFFm1SG2Na8YF4ELIDJ",
        escapedBuildId: "r1IFFm1SG2Na8YF4ELIDJ",
        basePath: "",
        pageIsDynamic: false,
        encodedPreviewProps: {previewModeId:"bbe90df6f7d989bbd687f468bcc0f941",previewModeSigningKey:"147db65c68fcc057f7163f332e800b841b2abff73f8dfb44d89eb0b53390151f",previewModeEncryptionKey:"496a6d7f61be7fd992247ff8fbe703f206bed0ec3aa8efe4641d56516d114e89"}
      })
      
    

/***/ }),

/***/ 441:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9008);
/* harmony import */ var _heroicons_react_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3801);
/* harmony import */ var _layouts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(162);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1277);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6971);






const getServerSideProps = async (context)=>{
    return {
        props: {}
    };
};
const Home = ()=>{
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(next_head__WEBPACK_IMPORTED_MODULE_1__["default"], {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "description",
                        content: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.home.description */ .jk.home.description
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "keywords",
                        content: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.home.keywords */ .jk.home.keywords
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                        rel: "canonical",
                        href: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.home.canonical */ .jk.home.canonical
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                        children: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.home.title */ .jk.home.title
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_layouts__WEBPACK_IMPORTED_MODULE_3__/* .Standard */ .q, {
                fixedHeader: false,
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .Section */ .$0, {
                        id: "search",
                        className: "bg-teal-50 dark:bg-grey-400",
                        waveFillTop: "fill-teal-100 dark:fill-grey-500 transition-colors duration-500",
                        waveFillMiddle: "fill-teal-200 dark:fill-grey-600 transition-colors duration-500",
                        waveFillBottom: "fill-teal-300 dark:fill-grey-900 transition-colors duration-500",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "container mx-auto px-8 pt-16 pb-8",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "mx-auto block lg:w-2/3 2xl:w-1/2",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .Search */ .ol, {})
                            })
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .SectionTwo */ .Is, {
                        id: "content",
                        className: "bg-teal-300 dark:bg-grey-900",
                        waveFillTop: "fill-teal-200 dark:fill-grey-600 transition-colors duration-500",
                        waveFillMiddle: "fill-teal-100 dark:fill-grey-700 transition-colors duration-500",
                        waveFillBottom: "fill-teal-50 dark:fill-grey-800 transition-colors duration-500",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "container mx-auto grid grid-cols-1 gap-6 px-8 py-16 lg:grid-cols-2",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                    className: "block font-montserrat text-2xl font-bold text-grey-800 dark:text-white lg:col-span-2",
                                    children: "What is Octopus?"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .HTMLVideo */ .Qh, {
                                    srcWebM: "/video/webm/a_quick_introduction_to_octopus.webm",
                                    srcMp4: "/video/mp4/a_quick_introduction_to_octopus.mp4",
                                    title: "A quick introduction to Octopus: the new primary research record for science",
                                    showCaption: false,
                                    controls: true,
                                    poster: "/images/jpg/poster.jpg",
                                    width: 800
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                            className: "mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white",
                                            children: "Publish freely"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: "mb-10 block text-base text-grey-800 dark:text-white",
                                            children: "Upload your publications when they are done. No need to wait around until you have a full scientific paper ready."
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                            className: "mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white",
                                            children: "Establish priority"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: "mb-10 block text-base text-grey-800 dark:text-white",
                                            children: "Stake your claim on an idea early, and establish your interests."
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                            className: "mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white",
                                            children: "Get quick peer reviews"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: "mb-8 block text-base text-grey-800 dark:text-white",
                                            children: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                            className: "mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white",
                                            children: "Meritocracy"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: "mb-24 block text-base text-grey-800 dark:text-white",
                                            children: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .ExtendedLink */ .O7, {
                                            href: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.about.path */ .jk.about.path,
                                            title: "Read more about Octopus"
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .Section */ .$0, {
                        id: "getStarted",
                        className: "bg-teal-50 dark:bg-grey-800",
                        waveFillTop: "fill-teal-100 dark:fill-grey-500 transition-colors duration-500",
                        waveFillMiddle: "fill-teal-200 dark:fill-grey-600 transition-colors duration-500",
                        waveFillBottom: "fill-teal-300 dark:fill-grey-900 transition-colors duration-500",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "container mx-auto px-8 py-16",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                    className: "mx-auto mb-6 block w-fit font-montserrat text-2xl font-bold text-grey-900 transition-colors duration-500 dark:text-white lg:mb-16",
                                    children: "Get started with Octopus"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components__WEBPACK_IMPORTED_MODULE_5__/* .Paper */ .Xk, {
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_2__/* .DesktopComputerIcon */ .DAM, {
                                                    className: "mb-8 h-10 w-10 text-teal-500"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                    className: "mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white",
                                                    children: "Browse publications"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: "mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50",
                                                    children: "Designed to replace journals and papers as the place to establish priority and record your work in full detail."
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .ExtendedLink */ .O7, {
                                                    href: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.browsePublications.path */ .jk.browsePublications.path,
                                                    title: "Browse publications"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components__WEBPACK_IMPORTED_MODULE_5__/* .Paper */ .Xk, {
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_2__/* .SearchIcon */ .W1M, {
                                                    className: "mb-8 h-10 w-10 text-teal-500"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                    className: "mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white",
                                                    children: "Search publications"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: "mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50",
                                                    children: "Designed to replace journals and papers as the place to establish priority and record your work in full detail."
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .ExtendedLink */ .O7, {
                                                    href: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.search.path */ .jk.search.path,
                                                    title: "Search publications"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components__WEBPACK_IMPORTED_MODULE_5__/* .Paper */ .Xk, {
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_2__/* .PencilIcon */ .vdY, {
                                                    className: "mb-8 h-10 w-10 text-teal-500"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                    className: "mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white",
                                                    children: "Publish your work"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: "mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50",
                                                    children: "Designed to replace journals and papers as the place to establish priority and record your work in full detail."
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .ExtendedLink */ .O7, {
                                                    href: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.createPublication.path */ .jk.createPublication.path,
                                                    title: "Publish your work"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .SectionTwo */ .Is, {
                        id: "helpImprove",
                        className: "bg-teal-300 dark:bg-grey-900",
                        waveFillTop: "fill-teal-500 dark:fill-grey-600 transition-colors duration-500",
                        waveFillMiddle: "fill-teal-600 dark:fill-grey-700 transition-colors duration-500",
                        waveFillBottom: "fill-teal-700 dark:fill-grey-800 transition-colors duration-500",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                    className: "mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8",
                                    children: "Help us improve Octopus"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                    className: "mb-6 block font-montserrat text-xl font-semibold xl:mb-12 xl:w-1/2",
                                    children: "Help us to make Octopus the best it can be. if you have feedback, please contact us."
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .zx, {
                                    href: _config__WEBPACK_IMPORTED_MODULE_4__/* .urls.feedback.path */ .jk.feedback.path,
                                    title: "Send us feedback"
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);


/***/ }),

/***/ 1014:
/***/ ((module) => {

module.exports = require("critters");

/***/ }),

/***/ 2186:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@ampproject/toolbox-optimizer");

/***/ }),

/***/ 9491:
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 3477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 2781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ 6224:
/***/ ((module) => {

module.exports = require("tty");

/***/ }),

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [799,402], () => (__webpack_exec__(537)));
module.exports = __webpack_exports__;

})();