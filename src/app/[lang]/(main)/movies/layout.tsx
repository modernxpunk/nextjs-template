const Layout = ({ children, modal }: any) => {
	console.log("hello layout");
	return (
		<div>
			{children}
			{modal}
		</div>
	);
};

export default Layout;
