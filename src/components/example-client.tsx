"use client";

import { Button } from "@ui/Button";
import { Modal } from "@ui/Modal";
import { useState } from "react";

const Example = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div>
			<Button onClick={() => setIsOpen(true)}>open modal</Button>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				Hello world
			</Modal>
			<h3 className="text-2xl font-bold font-title">Hello world</h3>
		</div>
	);
};

export default Example;
