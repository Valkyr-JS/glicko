import { default as StashReact } from "react";
import { faChessRook } from "@fortawesome/free-solid-svg-icons";
import * as FontAwesomeRegular from "@fortawesome/free-regular-svg-icons";
import * as FontAwesomeSolid from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { JSXElementConstructor } from "react";

const PluginApi = window.PluginApi;
const FAIcon = PluginApi.components.Icon;
const React = PluginApi.React;

// Wait for the navbar to load, as this contains the
PluginApi.patch.instead(
  "MainNavBar.MenuItems",
  function ({ children, ...props }, _, Original) {
    const link = "/plugin/glicko/assets/app/";

    // Add the button to the navbar
    return [
      <Original {...props}>
        {children}
        <div
          data-rb-event-key={link}
          className="col-4 col-sm-3 col-md-2 col-lg-auto nav-link"
          id="GlickoButton"
        >
          <a
            href={link}
            className="minimal p-4 p-xl-2 d-flex d-xl-inline-block flex-column justify-content-between align-items-center btn btn-primary"
            target="_blank"
          >
            <FAIcon
              className="fa-icon nav-menu-icon d-block d-xl-inline mb-2 mb-xl-0"
              icon={faChessRook}
            />
            <span>Glicko</span>
          </a>
        </div>
      </Original>,
    ];
  }
);

declare global {
  interface Window {
    PluginApi: {
      components: {
        Icon: typeof FontAwesomeIcon;
      };
      libraries: {
        FontAwesomeRegular: typeof FontAwesomeRegular;
        FontAwesomeSolid: typeof FontAwesomeSolid;
      };
      patch: {
        instead: {
          (
            component: "MainNavBar.MenuItems",
            fn: (
              props: React.PropsWithChildren,
              _: object,
              Original: JSXElementConstructor<React.PropsWithChildren>
            ) => React.JSX.Element[]
          ): void;
        };
      };
      React: typeof StashReact;
    };
  }
}
