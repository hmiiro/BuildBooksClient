import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Container, Row, Col, Card, CardBody, Label, FormGroup, Button, Alert } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import LoaderWidget from '../../components/Loader';
import logo from '../../assets/images/logo.png';
import { useForm } from '../../helpers/utils/hooks';
import { AuthContext } from '../../context/auth';

function Login(props) {
    //#region CL State
    const context = useContext(AuthContext);
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    //#endregion

    //#region CL handlers and api hooks

    const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
        update(_, { data: { login: userData } }) {
            context.login(userData);
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function loginUserCallback() {
        loginUser();
    }
    //#endregion
    return (
        <React.Fragment>
            <div className="account-pages mt-5 mb-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={5}>
                            <Card>
                                <div className="card-header pt-4 pb-4 text-center bg-primary">
                                    <Link to="/">
                                        <span>
                                            <img src={logo} alt="" height="18" />
                                        </span>
                                    </Link>
                                </div>

                                <CardBody className="p-4 position-relative">
                                    {/* preloader */}
                                    {loading && <LoaderWidget />}

                                    <div className="text-center w-75 m-auto">
                                        <h4 className="text-dark-50 text-center mt-0 font-weight-bold">Login</h4>
                                        <p className="text-muted mb-4">
                                            Enter your username and password to access home.
                                        </p>
                                    </div>

                                    {Object.keys(errors).length > 0 && (
                                        <Alert color="danger" isOpen={errors ? true : false}>
                                            <div>
                                                <ul>
                                                    {Object.values(errors).map((value) => (
                                                        <li key={value}>{value}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Alert>
                                    )}

                                    <AvForm onValidSubmit={onSubmit}>
                                        <AvField
                                            name="username"
                                            label="Username"
                                            placeholder="Enter your username"
                                            value={values.username}
                                            onChange={onChange}
                                            required
                                        />

                                        <AvGroup>
                                            <Label for="password">Password</Label>
                                            <a href="/account/forget-password" className="text-muted float-right">
                                                <small>Forgot your password?</small>
                                            </a>
                                            <AvInput
                                                type="password"
                                                name="password"
                                                id="password"
                                                placeholder="Enter your password"
                                                value={values.password}
                                                onChange={onChange}
                                                required
                                            />
                                            <AvFeedback>This field is invalid</AvFeedback>
                                        </AvGroup>

                                        <FormGroup>
                                            <Button color="success">Login</Button>
                                        </FormGroup>
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mt-1">
                        <Col className="col-12 text-center">
                            <p className="text-muted">
                                Don't have an account?
                                <Link to="/account/register" className="text-muted ml-1">
                                    <b>Register</b>
                                </Link>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

//#region API CALL
const LOGIN_USER_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            username
            email
            token
            role
            actions
        }
    }
`;
//#endregion
export default Login;
