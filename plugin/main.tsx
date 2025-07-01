import { type OperationVariables, type QueryResult } from "@apollo/client";
import { default as React, type JSXElementConstructor } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { faChessRook } from "@fortawesome/free-solid-svg-icons";
import * as FontAwesomeRegular from "@fortawesome/free-regular-svg-icons";
import * as FontAwesomeSolid from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigResult, Performer } from "./stashGQL";

const PluginApi = window.PluginApi;
const FAIcon = PluginApi.components.Icon;

const resolveJSON: <T>(string: string) => T | null = (str: string) => {
  let json = null;
  try {
    json = JSON.parse(str);
  } catch (e) {
    console.log(e);
  }
  return json;
};

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
    const [config, setConfig] = React.useState<PluginOptions | null>(null);
    const configResult = PluginApi.GQL.useConfigurationQuery();

    React.useEffect(() => {
      setConfig(configResult.data?.configuration.plugins.glicko ?? null);
    }, [configResult]);

    // If plugin options have not yet loaded, or the user has not enabled footer rating
    if (!config || !config.rankInCardFooter) return [<Original {...props} />];

    // If there is no rank, return the original component.
    if (!props.performer.custom_fields.glicko_session_history)
      return [<Original {...props} />];

    // If the glicko_session_history does not resolve to valid data, return the
    // original component.
    const { glicko_session_history } = props.performer.custom_fields;
    const sessionHistory = resolveJSON<PerformerSessionRecord[]>(
      glicko_session_history ?? ""
    );

    if (!sessionHistory) return [<Original {...props} />];

    const rank = "#" + sessionHistory[sessionHistory.length - 1].n;
    const rating = props.performer.custom_fields.glicko_rating
      ? "Rating: " + Math.floor(props.performer.custom_fields.glicko_rating)
      : "Error getting rating";

    const tooltip = <Tooltip id="glicko-rating-tooltip">{rating}</Tooltip>;

    return [
      <>
        <Original {...props} />
        <div className="card-popovers btn-group">
          <div>
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <button type="button" className="minimal btn btn-primary">
                <FAIcon icon={faChessRook} />
                <span>{rank}</span>
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </>,
    ];
  }
);

/* ---------------------------------------------------------------------------------------------- */
/*                                              Types                                             */
/* ---------------------------------------------------------------------------------------------- */

interface PerformerSessionRecord {
  /** The ISO datetime of the session. */
  d: string;
  /** The Glicko rating of the performer at the end of the session. */
  g: number;
  /** The rank of the performer at the end of the session. */
  n: number;
}

interface PluginOptions {
  /** When enabled, the performer's Glicko rank is displayed in their card
   * footer. */
  rankInCardFooter?: boolean;
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
        before<T>(component: string, fn: (props: T) => [T]): void;
        before(
          component: "PerformerCard.Popovers",
          fn: (props: PerformerCardProps) => [PerformerCardProps]
        ): void;
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
              props: PerformerCardProps,
              _: object,
              Original: JSXElementConstructor<PerformerCardProps>
            ) => React.JSX.Element[]
          ): void;
        };
      };
      React: typeof React;
    };
  }
}

interface PerformerCardProps {
  performer: Performer & {
    custom_fields: {
      glicko_deviation?: number;
      glicko_rating?: number;
      glicko_volatility?: number;
      glicko_wins?: number;
      glicko_losses?: number;
      glicko_ties?: number;
      glicko_match_history?: string;
      glicko_session_history?: string;
    };
  };
}
