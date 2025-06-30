import { type OperationVariables, type QueryResult } from "@apollo/client";
import { default as StashReact } from "react";
import { faChessRook } from "@fortawesome/free-solid-svg-icons";
import * as FontAwesomeRegular from "@fortawesome/free-regular-svg-icons";
import * as FontAwesomeSolid from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { JSXElementConstructor } from "react";
import { ConfigResult } from "./stashGQL";

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

PluginApi.patch.instead(
  "PerformerCard.Popovers",
  function (props, _, Original) {
    console.log(fetchPluginOptions());
    console.log(props);

    // Add the button to the navbar
    return [<Original {...props} />];
  }
);

/** Gets the Glicko user options and caches them to session storage for 5
 * seconds to reduce calls to the database. */
const fetchPluginOptions = async () => {
  // First check if the plugin options are already saved to session storage.
  const optionsString = sessionStorage.getItem("glickoConfig");
  const options = optionsString
    ? (JSON.parse(optionsString) as PluginOptions)
    : null;

  if (options) {
    console.log("exists");

    return options;
  }

  // Otherwise call API to get data, then remove from session storage after 3
  // seconds so it doesn't stay cached too long and user changes aren't picked
  // up.
  const configResult = PluginApi.GQL.useConfigurationQuery();

  if (!configResult.error && !configResult.loading) {
    console.log(configResult);
    const pluginOptions = configResult.data?.configuration.plugins.glicko;
    console.log(pluginOptions);
    sessionStorage.setItem("glickoConfig", JSON.stringify(pluginOptions));
    console.log("added");

    setTimeout(() => {
      console.log("removed");
      sessionStorage.removeItem("glickoConfig");
    }, 3000);

    return pluginOptions;
  }
  return null;
};

interface PluginOptions {
  /** When enabled, the performer's Glicko rating is displayed in their card
   * footer. */
  ratingInCardFooter?: boolean;
}

declare global {
  interface Window {
    PluginApi: {
      GQL: {
        useConfigurationQuery(): QueryResult<
          { configuration: ConfigResult },
          OperationVariables
        >;
      };
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
          (
            component: "PerformerCard.Popovers",
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
