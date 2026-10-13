import { shareableHandle } from "@/core/AppMaster";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Portal from "@mui/material/Portal";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import React, { JSX } from "react";




export const Overlay = ({ show, children, onClick }: { show: boolean, children?: React.ReactNode, onClick?: () => void }) => {
	  React.useEffect(() => {
			 if (show) {
					try {
						  const prev = document.body.style.overflow;
						  document.body.style.overflow = "hidden";
						  return () => {
								 document.body.style.overflow = prev;
						  };
					} catch (e) {
					}
			 }
	  }, [ show ]);
	  return show && <Portal>
			 <Box
						sx={ {
							  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
							  zIndex: 2000,
							  backgroundColor: "rgba(0,0,0,0.75)",
							  display: "flex", justifyContent: "center", alignItems: "center"
						} }
						onClick={ e => onClick ? onClick() : e.stopPropagation() }
						onScroll={ e => e.preventDefault() }
			 >
					{ children }
			 </Box>
	  </Portal>;
};


const WiPView = ({ show, message, children }: { show: boolean, message?: string, children?: React.ReactNode }) => {
	  const theme = useTheme();
	  return <>
			 <Overlay show={ show }>
					<Stack
							  spacing={ 2 } alignItems={ "center" } borderRadius={ 1 } p={ 4 }
							  sx={ { backgroundColor: theme.palette.background.paper, userSelect: "none" } }
					>
						  <CircularProgress size={ 60 }/>
						  <Typography variant={ "h6" }>
								 { message || "Working on it…" }
						  </Typography>
						  { children }
					</Stack>
			 </Overlay>
	  </>;
};

export const useWipView = () => {
	  const [ show, setShow ] = React.useState(false);
	  const [ message, setMessage ] = React.useState("");
	  const Component: ({ children }: { children?: React.ReactNode }) => JSX.Element = React.useMemo(() => {
			 return ({ children }: { children: React.ReactNode }) => {
					return <WiPView show={ show } message={ message }>{ children }</WiPView>;
			 };
	  }, [ show, message ]);
	  return {
			 WiPView: Component,
			 open: () => setShow(true),
			 close: () => setShow(false),
			 setUi: (value: any, exit = true) => {
					setMessage(value?.message || value?.toString() || "");
					exit && setTimeout(() => setShow(false), 3000);
			 }
	  };
};


/**
 * A hook that provides a {@link Snackbar} component and a function to perform an action and show the snackbar.
 */
export const useSnackbar = () => {
	  const [ show, setShow ] = React.useState(false);
	  const performActionAndShow = (fn: (param?: any) => void) => {
			 fn?.();
			 setShow(true);
	  };
	  const Component = React.useMemo(() => ({ message, duration = 3000, onClose }: { message: string, duration?: number, onClose?: () => void }) => {
			 return <Snackbar
						open={ show }
						autoHideDuration={ duration }
						onClose={ () => {
							  setShow(false);
							  onClose?.();
						} }
						message={ message }
			 />;
	  }, [ show ]);
	  return { Snackbar: Component, performActionAndShow };
};


/**
* When {@param isPath} is true, the {@param value} or {@param txt} is ignored and the current path is copied.
* When {@param isLink} is true, the {@param value} or {@param txt} is wrapped in {@link shareableHandle}.
* When {@param isPath} and {@param isLink} are false, the {@param value} or {@param txt} is copied as is.
*/
export const useTextCopier = ({ field = "Text", value = "", isLink = true, isPath = false }: { field?: string, value?: string, isLink?: boolean,isPath?:boolean } = {}) => {
	  const { Snackbar, performActionAndShow } = useSnackbar();
	  const path = usePathname();
	  const copy = (txt = "") => performActionAndShow(() => navigator.clipboard.writeText(isPath? shareableHandle(path.substring(1)):isLink ? shareableHandle(txt || value)   : (txt || value)));
	  return {
			 copy,
			 Snackbar: () => <Snackbar message={ field + " copied to clipboard!" }/>
	  };
};

/**
 * A hook that provides a forced-interaction MUI Dialog for moderation confirmations.
 */
export const useConfirmationDialog = () => {
	  const [ open, setOpen ] = React.useState(false);
	  const [ message, setMessage ] = React.useState("");
	  const [ onConfirm, setOnConfirm ] = React.useState<(() => void) | null>(null);
	  
	  const ask = (msg: string, onConfirmed: () => void) => {
			 setMessage(msg);
			 setOnConfirm(() => onConfirmed);
			 setOpen(true);
	  };

	  const handleChoice = (choice: boolean) => {
			 setOpen(false);
			 if (choice && onConfirm) onConfirm();
	  };

	  const Component = React.useMemo(() => () => {
			 return (
						<Dialog open={ open }>
							  <DialogTitle>{ "Confirm Action" }</DialogTitle>
							  <DialogContent>
									 <DialogContentText>{ message }</DialogContentText>
							  </DialogContent>
							  <DialogActions>
									 <Button variant={"text"} color={"error"} onClick={ () => handleChoice(false) }>{ "Cancel" }</Button>
									 <Button variant={"outlined"} color={"error"} onClick={ () => handleChoice(true) } autoFocus={ true }>{ "Confirm" }</Button>
							  </DialogActions>
						</Dialog>
			 );
	  }, [ open, message, onConfirm ]);

	  return { ask, ConfirmationDialog: Component };
};
