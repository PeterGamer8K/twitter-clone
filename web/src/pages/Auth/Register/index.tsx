import React, {
	EventHandler,
	MouseEventHandler,
	useContext,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ButtonMain } from "../../../components/ButtonMain";
import { InputMain } from "../../../components/InputMain";
import { TextBodyBold } from "../../../components/Typography/TextBodyBold";
import { TextCode } from "../../../components/Typography/TextCode";
import { theme } from "../../../public/theme";
import { apiBackendFunctions } from "../../../services/apiBackend";
import { AuthContext } from "../../../utils/contexts/AuthContext";
import { AuthUseCase } from "../AuthUseCase";
import { Container, MainFrame, Title, Form, Footer, TextLink } from "./style";

const authUseCase = new AuthUseCase();

export function Register() {
	const [emailText, setEmailText] = useState("");
	const [passwordText, setPasswordText] = useState("");
	const [nameText, setNameText] = useState("");
	const [identifierText, setIdentifierText] = useState("");
	const [profilePictureURL, setProfilePictureURL] = useState("");

	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

	interface IUserToCreate {
		email: string;
		name: string;
		identifier: string;
		password: string;
		profile_picture: string;
	}

	function throwError(errorMessage: string) {
		alert(errorMessage);
	}

	async function handleLogIn(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		event.preventDefault();

		if (!authUseCase.isValidEmail(emailText)) {
			throwError("Email no formato inválido");
		}

		const userToCreate: IUserToCreate = {
			email: emailText,
			name: nameText,
			password: passwordText,
			identifier: identifierText,
			profile_picture: profilePictureURL,
		};

		let response = await apiBackendFunctions.registerUser({
			email: userToCreate.email,
			identifier: userToCreate.identifier,
			name: userToCreate.name,
			password: userToCreate.password,
			profile_picture:
				"https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?fit=300%2C300&ssl=1",
		});

		if (response.error) {
			throwError(response.msg);
		}

		response = await apiBackendFunctions.loginUser({
			email: userToCreate.email,
			password: userToCreate.password,
		});

		if (response.error) {
			throwError(response.msg);
			return;
		}

		authContext?.register();
		navigate("/");
	}

	function handleProfilePictureChange(
		event: React.ChangeEvent<HTMLInputElement>
	) {
		const URL = event?.target.value;

		setProfilePictureURL(URL);
	}

	function handleEmailInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const text = event?.target.value;

		setEmailText(text);
	}

	function handlePasswordInputChange(
		event: React.ChangeEvent<HTMLInputElement>
	) {
		const text = event?.target.value;
		setPasswordText(text);
	}

	function handleNameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const text = event?.target.value;
		setNameText(text);
	}

	function handleIdentifierInputChange(
		event: React.ChangeEvent<HTMLInputElement>
	) {
		const text = event?.target.value;
		setIdentifierText(text);
	}
	return (
		<Container>
			<MainFrame>
				<header>
					<TextBodyBold>
						<Title>Crie sua conta</Title>
					</TextBodyBold>
				</header>

				<Form>
					<InputMain
						onChange={(event) => {
							handleEmailInputChange(event);
						}}
						type={"email"}
						placeholder="E-mail"
					/>
					<InputMain
						onChange={(event) => {
							handlePasswordInputChange(event);
						}}
						type={"password"}
						placeholder="Senha"
					/>
					<InputMain
						onChange={(event) => {
							handleNameInputChange(event);
						}}
						type={"text"}
						placeholder="Seu name"
					/>
					<InputMain
						onChange={(event) => {
							handleIdentifierInputChange(event);
						}}
						type={"text"}
						placeholder="Digite um identificador"
					/>

					<ButtonMain
						type="submit"
						onClick={handleLogIn}
						style={{
							borderRadius: 18,
						}}
						text="Criar conta"
					/>
				</Form>

				<Footer>
					<span style={{ textAlign: "center" }}>
						<TextCode>Já tem uma conta?</TextCode>
					</span>

					<div
						style={{
							color: theme.colors.theme.light,
						}}
					>
						<TextBodyBold>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<TextLink
									style={{
										fontSize: 24,
										textAlign: "center",
									}}
									onClick={() => {
										navigate("/login");
									}}
								>
									Conecte-se
								</TextLink>
							</div>
						</TextBodyBold>
					</div>
				</Footer>
			</MainFrame>
		</Container>
	);
}
