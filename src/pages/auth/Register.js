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

function Register(props) {
    //#region CL State
    const context = useContext(AuthContext);
    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    //#endregion

    //#region CL handlers and api hooks

    const [addUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
        update(_, { data: { register: userData } }) {
            context.login(userData);
            props.history.push('/account/login');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function registerUser() {
        addUser();
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
                                        <h4 className="text-dark-50 text-center mt-0 font-weight-bold">
                                            Create Your Account
                                        </h4>
                                        <p className="text-muted mb-4">
                                            Don't have an account? Create your account, it takes less than a minute
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
                                            label="User Name"
                                            placeholder="Enter your name"
                                            value={values.username}
                                            onChange={onChange}
                                            required
                                        />

                                        <AvField
                                            type="email"
                                            name="email"
                                            label="Email address"
                                            placeholder="Enter your email"
                                            value={values.email}
                                            onChange={onChange}
                                            required
                                        />

                                        <AvGroup>
                                            <Label for="password">Password</Label>
                                            <AvInput
                                                type="password"
                                                name="password"
                                                value={values.password}
                                                onChange={onChange}
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <AvFeedback>This field is invalid</AvFeedback>
                                        </AvGroup>
                                        <AvGroup>
                                            <Label for="password">Confirm Password</Label>
                                            <AvInput
                                                type="password"
                                                name="confirmPassword"
                                                value={values.confirmPassword}
                                                onChange={onChange}
                                                placeholder="Confirm your password"
                                                required
                                            />
                                            <AvFeedback>This field is invalid</AvFeedback>
                                        </AvGroup>

                                        <FormGroup>
                                            <Button color="success">Submit</Button>
                                        </FormGroup>
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mt-1">
                        <Col className="col-12 text-center">
                            <p className="text-muted">
                                Already have an account?{' '}
                                <Link to="/account/login" className="text-muted ml-1">
                                    <b>Sign In</b>
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
const REGISTER_USER_MUTATION = gql`
    mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            createdAt
            token
        }
    }
`;
//#endregion
export default Register;
