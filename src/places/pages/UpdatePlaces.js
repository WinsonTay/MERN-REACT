import React, { useEffect, useState, useContext } from "react";
import {AuthContext} from '../../shared/context/auth-context'
import { useParams ,  useHistory} from "react-router-dom";
import useHttpClient from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElement/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validator";
import "./PlaceForm.css";


const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [identifiedPlace, setPlace] = useState(null);
  // Get Route parameters
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext) 

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    const fetchPlaceId = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        console.log(responseData);
        setPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.title,
              isValid: true,
            },
            description: {
              value: responseData.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaceId();
  }, [sendRequest, placeId, setFormData]);

  if (!identifiedPlace && !isLoading) {
    return (
      <Card
        style={{ left: "50%", transform: "translateX(-50%)", width: "50%" }}
        className="center"
      >
        <h2>Could Not find place!</h2>
      </Card>
    );
  }
  if (isLoading && !error) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  const updatePlaceHandler = async () => {
    try {
       await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        { "Content-Type": "application/json",
          "Authorization": "Bearer "+auth.token });
        history.push(`/${identifiedPlace.creator}/places`)
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {!isLoading && identifiedPlace && (
        <form className="place-form" onSubmit={updatePlaceHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter Valid title"
            initialValue={identifiedPlace.title}
            initialValid={true}
            onInput={InputHandler}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please Enter valid 5 characters"
            initialValue={identifiedPlace.description}
            initialValid={true}
            onInput={InputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACES
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};
export default UpdatePlace;
