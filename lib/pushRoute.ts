import { AppContextInterface } from "@/context/AppContext";

function pushRoute({router, appState, route}: {router: any, appState: AppContextInterface, route: string}) {
    const currentPathname = window.location.pathname;
    if (currentPathname !== route) {
        appState.setState({...appState.state, isTransitioning: true});
        router.push(route);
    }
}

export { pushRoute };