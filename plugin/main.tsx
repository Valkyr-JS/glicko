import { type OperationVariables, type QueryResult } from "@apollo/client";
import { default as React, type JSXElementConstructor } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { faChessRook } from "@fortawesome/free-solid-svg-icons";
import * as FontAwesomeRegular from "@fortawesome/free-regular-svg-icons";
import * as FontAwesomeSolid from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigResult, Performer } from "./stashGQL";
import "./styles.scss";

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
  "PerformerCard.Overlays",
  function (props, _, Original) {
    const [config, setConfig] = React.useState<PluginOptions | null>(null);
    const configResult = PluginApi.GQL.useConfigurationQuery();

    React.useEffect(() => {
      setConfig(configResult.data?.configuration.plugins.glicko ?? null);
    }, [configResult]);

    // If plugin options have not yet loaded, or the user has not enabled banner
    // rating
    if (!config || (!config.rankInBanner && !config.rankInImage))
      return [<Original {...props} />];

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
    const rating = Math.floor(props.performer.custom_fields.glicko_rating ?? 0);

    const banner = config.rankInBanner ? (
      <div className="rating-banner glicko-rating-banner">
        <FAIcon icon={faChessRook} />{" "}
        <span>{config.ratingNotRank ? rating : rank}</span>
      </div>
    ) : null;

    const rankOverlay = config.rankInImage ? (
      <div className="glicko-rating-overlay small">
        <FAIcon icon={faChessRook} /> {config.ratingNotRank ? rating : rank}
      </div>
    ) : null;

    return [
      <>
        {banner}
        <Original {...props} />
        {rankOverlay}
      </>,
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
      ? Math.floor(props.performer.custom_fields.glicko_rating)
      : "Error getting rating";

    const tooltipContent = config.ratingNotRank ? rank : rating;
    const buttonContent = config.ratingNotRank ? rating : rank;

    const tooltip = (
      <Tooltip id="glicko-rating-tooltip">{tooltipContent}</Tooltip>
    );

    return [
      <>
        <Original {...props} />
        <div className="card-popovers btn-group">
          <div>
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <button type="button" className="minimal btn btn-primary">
                <FAIcon icon={faChessRook} />
                <span>{buttonContent}</span>
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </>,
    ];
  }
);

PluginApi.patch.instead("PerformerDetailsPanel", function (props, _, Original) {
  const [config, setConfig] = React.useState<PluginOptions | null>(null);
  const configResult = PluginApi.GQL.useConfigurationQuery();

  React.useEffect(() => {
    setConfig(configResult.data?.configuration.plugins.glicko ?? null);
  }, [configResult]);

  // If plugin options have not yet loaded, or the user has not enabled display,
  // return the original component.
  if (!config || (!config.rankOnPage && !config.ratingOnPage))
    return [<Original {...props} />];

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

  const rank = config.rankOnPage ? (
    <span>
      <span className="sr-only">Glicko rank:</span>
      {"#" + sessionHistory[sessionHistory.length - 1].n}
    </span>
  ) : null;

  const rating = config.ratingOnPage ? (
    <span>
      <span className="sr-only">Glicko rating:</span>
      {Math.floor(props.performer.custom_fields.glicko_rating ?? 0)}
    </span>
  ) : null;

  const separator =
    config.rankOnPage && config.ratingOnPage ? (
      <span className="mx-2">|</span>
    ) : null;

  return [
    <>
      <div className="ml-2 glicko-rating-number">
        <span>
          <FAIcon icon={faChessRook} />
          {rank}
          {separator}
          {rating}
        </span>
      </div>
      <Original {...props} />
    </>,
  ];
});

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
  /** When enabled, the performer's Glicko rank is displayed in place of their
   * Stash rating. */
  rankInBanner?: boolean;
  /** When enabled, the performer's Glicko rank is displayed in their card
   * footer. */
  rankInCardFooter?: boolean;
  /** When enabled, the performer's Glicko rank is displayed in the bottom-left
   * corner of their card image. */
  rankInImage?: boolean;
  /** When enabled, the performer's Glicko rank is displayed next to their Stash
   * rating on their profile page. */
  rankOnPage?: boolean;
  /** When enabled, the performer's Glicko rating is displayed next to their
   * Stash rating on their profile page. */
  ratingOnPage?: boolean;
  /** When enabled, the performer's Glicko rating is displayed in place of their
   * rank in the Stash performer cards. */
  ratingNotRank?: boolean;
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
          component: "PerformerCard.Overlays",
          fn: (props: IPerformerCardProps) => [IPerformerCardProps]
        ): void;
        before(
          component: "PerformerCard.Popovers",
          fn: (props: IPerformerCardProps) => [IPerformerCardProps]
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
              props: IPerformerCardProps,
              _: object,
              Original: JSXElementConstructor<IPerformerCardProps>
            ) => React.JSX.Element[]
          ): void;
          (
            component: "PerformerCard.Overlays",
            fn: (
              props: IPerformerCardProps,
              _: object,
              Original: JSXElementConstructor<IPerformerCardProps>
            ) => React.JSX.Element[]
          ): void;
          (
            component: "PerformerDetailsPanel",
            fn: (
              props: IPerformerDetails,
              _: object,
              Original: JSXElementConstructor<IPerformerDetails>
            ) => React.JSX.Element[]
          ): void;
        };
      };
      React: typeof React;
    };
  }
}

type PerformerData = Performer & {
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

interface IPerformerCardProps {
  performer: PerformerData;
  cardWidth?: number;
  ageFromDate?: string;
  selecting?: boolean;
  selected?: boolean;
  zoomIndex?: number;
  onSelectedChanged?: (selected: boolean, shiftKey: boolean) => void;
}

interface IPerformerDetails {
  performer: PerformerData;
  collapsed?: boolean;
  fullWidth?: boolean;
}
