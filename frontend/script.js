(() => {

    "use strict";


    /* =====================================================
       FASTAPI CONFIGURATION
       ===================================================== */

    /*
        Your FastAPI is assumed to run with:

        uvicorn main:app --reload

        Default address:

        http://127.0.0.1:8000
    */

    const API_BASE = "http://127.0.0.1:8000";


    /*
        If you run FastAPI on port 2200 instead, use:

        const API_BASE = "http://127.0.0.1:2200";
    */


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const form =
        document.getElementById("predict-form");


    const submitBtn =
        document.getElementById("submit-btn");


    const resetBtn =
        document.getElementById("reset-btn");


    const errorRetryBtn =
        document.getElementById("error-retry-btn");


    /* Prediction states */

    const stateIdle =
        document.getElementById("state-idle");


    const stateLoading =
        document.getElementById("state-loading");


    const stateResult =
        document.getElementById("state-result");


    const stateError =
        document.getElementById("state-error");


    /* Result elements */

    const scoreNumber =
        document.getElementById("score-number");


    const scoreBand =
        document.getElementById("score-band");


    const scoreContext =
        document.getElementById("score-context");


    const gaugeFill =
        document.getElementById("gauge-fill");


    /* Error elements */

    const errorLabel =
        document.getElementById("error-label");


    const errorCopy =
        document.getElementById("error-copy");


    /* Stress */

    const stressGroup =
        document.getElementById("stress_level_group");


    const stressInput =
        document.getElementById("stress_level");


    /* =====================================================
       GAUGE CONFIGURATION
       ===================================================== */

    const GAUGE_LENGTH = 298;


    /* =====================================================
       SHOW ONLY ONE STATE
       ===================================================== */

    function showState(stateName) {

        /*
            Store every possible state
        */

        const states = {

            idle: stateIdle,

            loading: stateLoading,

            result: stateResult,

            error: stateError

        };


        /*
            Hide ALL states
        */

        Object.values(states).forEach(state => {

            if (state) {

                state.hidden = true;

            }

        });


        /*
            Show ONLY requested state
        */

        const activeState =
            states[stateName];


        if (activeState) {

            activeState.hidden = false;

        }

    }


    /* =====================================================
       RESET GAUGE
       ===================================================== */

    function resetGauge() {

        /*
            Disable animation temporarily
        */

        gaugeFill.style.transition = "none";


        /*
            Put gauge back to zero
        */

        gaugeFill.style.strokeDashoffset =
            String(GAUGE_LENGTH);


        /*
            Restore animation
        */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                gaugeFill.style.transition =
                    "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)";

            });

        });

    }


    /* =====================================================
       RESET RESULT DATA
       ===================================================== */

    function resetResultData() {

        scoreNumber.textContent =
            "0.00";


        scoreBand.textContent =
            "—";


        scoreBand.style.color =
            "";


        scoreContext.textContent =
            "";


        gaugeFill.style.stroke =
            "var(--blue)";


        resetGauge();

    }


    /* =====================================================
       STRESS BUTTONS
       ===================================================== */

    stressGroup
        .querySelectorAll(".stress-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    /*
                        Remove active state
                        from every button
                    */

                    stressGroup
                        .querySelectorAll(".stress-btn")
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    /*
                        Activate clicked button
                    */

                    button.classList.add(
                        "active"
                    );


                    /*
                        Save value into
                        hidden input
                    */

                    stressInput.value =
                        button.dataset.value;


                    /*
                        Remove validation error
                    */

                    clearFieldError(
                        stressInput
                    );

                }
            );

        });


    /* =====================================================
       FIND FIELD WRAPPER
       ===================================================== */

    function fieldWrapper(input) {

        return input.closest(
            ".field, .stress-field"
        );

    }


    /* =====================================================
       SET FIELD ERROR
       ===================================================== */

    function setFieldError(
        input,
        message
    ) {

        const wrapper =
            fieldWrapper(input);


        if (!wrapper) {

            return;

        }


        wrapper.classList.add(
            "field-error"
        );


        const errorElement =
            wrapper.querySelector(
                ".error-msg"
            );


        if (errorElement) {

            errorElement.textContent =
                message;

        }

    }


    /* =====================================================
       CLEAR FIELD ERROR
       ===================================================== */

    function clearFieldError(input) {

        const wrapper =
            fieldWrapper(input);


        if (!wrapper) {

            return;

        }


        wrapper.classList.remove(
            "field-error"
        );


        const errorElement =
            wrapper.querySelector(
                ".error-msg"
            );


        if (errorElement) {

            errorElement.textContent =
                "";

        }

    }


    /* =====================================================
       CLEAR ALL ERRORS
       ===================================================== */

    function clearAllErrors() {

        form
            .querySelectorAll(
                ".field-error"
            )
            .forEach(element => {

                element.classList.remove(
                    "field-error"
                );

            });


        form
            .querySelectorAll(
                ".error-msg"
            )
            .forEach(element => {

                element.textContent =
                    "";

            });

    }


    /* =====================================================
       COLLECT FORM DATA
       ===================================================== */

    function collectPayload() {

        const formData =
            new FormData(form);


        return {

            age:
                formData.get("age") === ""
                    ? NaN
                    : parseInt(
                        formData.get("age"),
                        10
                    ),


            gender:
                formData.get("gender") || "",


            country:
                (
                    formData.get("country")
                    || ""
                ).trim(),


            academic_level:
                formData.get(
                    "academic_level"
                ) || "",


            most_used_platform:
                formData.get(
                    "most_used_platform"
                ) || "",


            purpose_of_use:
                formData.get(
                    "purpose_of_use"
                ) || "",


            avg_daily_usage_hours:
                formData.get(
                    "avg_daily_usage_hours"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "avg_daily_usage_hours"
                        )
                    ),


            daily_unlocks:
                formData.get(
                    "daily_unlocks"
                ) === ""
                    ? NaN
                    : parseInt(
                        formData.get(
                            "daily_unlocks"
                        ),
                        10
                    ),


            study_hours:
                formData.get(
                    "study_hours"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "study_hours"
                        )
                    ),


            physical_activity_hours:
                formData.get(
                    "physical_activity_hours"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "physical_activity_hours"
                        )
                    ),


            sleep_hours_per_night:
                formData.get(
                    "sleep_hours_per_night"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "sleep_hours_per_night"
                        )
                    ),


            stress_level:
                formData.get(
                    "stress_level"
                ) || ""

        };

    }


    /* =====================================================
       VALIDATE PAYLOAD
       ===================================================== */

    function validate(payload) {

        const errors = [];


        /*
            Numeric fields
        */

        const numericFields = [

            [
                "age",
                10,
                100
            ],

            [
                "avg_daily_usage_hours",
                0,
                24
            ],

            [
                "daily_unlocks",
                0,
                Infinity
            ],

            [
                "study_hours",
                0,
                24
            ],

            [
                "physical_activity_hours",
                0,
                24
            ],

            [
                "sleep_hours_per_night",
                0,
                24
            ]

        ];


        numericFields.forEach(
            ([key, min, max]) => {

                const input =
                    document.getElementById(
                        key
                    );


                const value =
                    payload[key];


                /*
                    Required check
                */

                if (
                    value === "" ||
                    value === null ||
                    Number.isNaN(value)
                ) {

                    errors.push([
                        input,
                        "This field is required."
                    ]);

                    return;

                }


                /*
                    Range check
                */

                if (
                    value < min ||
                    value > max
                ) {

                    errors.push([
                        input,
                        `Value must be between ${min} and ${
                            max === Infinity
                                ? "∞"
                                : max
                        }.`
                    ]);

                }

            }
        );


        /*
            Text/select fields
        */

        const requiredTextFields = [

            "gender",

            "country",

            "academic_level",

            "most_used_platform",

            "purpose_of_use"

        ];


        requiredTextFields.forEach(
            key => {

                const input =
                    document.getElementById(
                        key
                    );


                if (
                    !payload[key] ||
                    String(
                        payload[key]
                    ).trim() === ""
                ) {

                    errors.push([
                        input,
                        "This field is required."
                    ]);

                }

            }
        );


        /*
            Stress
        */

        if (!payload.stress_level) {

            errors.push([
                stressInput,
                "Please select a stress level."
            ]);

        }


        return errors;

    }


    /* =====================================================
       SCORE INFORMATION
       ===================================================== */

    function getScoreInfo(score) {

        /*
            Lower score
        */

        if (score < 4) {

            return {

                label:
                    "Signal: Needs Attention",

                color:
                    "#ff304f",

                context:
                    "The model indicates a lower mental health score. Consider reviewing sleep, stress, physical activity and screen-time habits."

            };

        }


        /*
            Moderate score
        */

        if (score < 7) {

            return {

                label:
                    "Signal: Moderate",

                color:
                    "#2589ff",

                context:
                    "The model indicates a moderate mental health score. Maintaining balanced daily habits may help support your overall wellbeing."

            };

        }


        /*
            Strong score
        */

        return {

            label:
                "Signal: Strong",

            color:
                "#21df8a",

            context:
                "The model indicates a stronger mental health score based on the information provided. Continue maintaining healthy daily habits."

        };

    }


    /* =====================================================
       RENDER PREDICTION
       ===================================================== */

    function renderResult(score) {

        /*
            Convert to number
        */

        const numericScore =
            Number(score);


        /*
            Safety check
        */

        if (
            !Number.isFinite(
                numericScore
            )
        ) {

            renderError(
                "Invalid prediction",
                "The API returned an invalid prediction score."
            );

            return;

        }


        /*
            Keep score between 0 and 10
        */

        const safeScore =
            Math.max(
                0,
                Math.min(
                    10,
                    numericScore
                )
            );


        /*
            Get score category
        */

        const info =
            getScoreInfo(
                safeScore
            );


        /*
            Display score
        */

        scoreNumber.textContent =
            safeScore.toFixed(2);


        /*
            Display status
        */

        scoreBand.textContent =
            info.label;


        scoreBand.style.color =
            info.color;


        /*
            Display explanation
        */

        scoreContext.textContent =
            info.context;


        /*
            Change gauge color
        */

        gaugeFill.style.stroke =
            info.color;


        /*
            Reset gauge first
        */

        gaugeFill.style.transition =
            "none";


        gaugeFill.style.strokeDashoffset =
            String(GAUGE_LENGTH);


        /*
            Show result state
            before starting animation
        */

        showState("result");


        /*
            Animate gauge
        */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                gaugeFill.style.transition =
                    "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)";


                const percentage =
                    safeScore / 10;


                const offset =
                    GAUGE_LENGTH *
                    (1 - percentage);


                gaugeFill.style.strokeDashoffset =
                    String(offset);

            });

        });

    }


    /* =====================================================
       RENDER ERROR
       ===================================================== */

    function renderError(
        title,
        message
    ) {

        errorLabel.textContent =
            title;


        errorCopy.textContent =
            message;


        showState("error");

    }


    /* =====================================================
       FASTAPI 422 ERROR HANDLING
       ===================================================== */

    function applyServerErrors(detail) {

        if (
            !Array.isArray(detail)
        ) {

            return false;

        }


        let matched = false;


        detail.forEach(
            error => {

                const location =
                    Array.isArray(
                        error.loc
                    )
                        ? error.loc
                        : [];


                const field =
                    location[
                        location.length - 1
                    ];


                let input =
                    document.getElementById(
                        field
                    );


                /*
                    Stress level is hidden input
                */

                if (
                    field ===
                    "stress_level"
                ) {

                    input =
                        stressInput;

                }


                if (input) {

                    setFieldError(
                        input,
                        error.msg ||
                            "Invalid value."
                    );


                    matched = true;

                }

            }
        );


        return matched;

    }


    /* =====================================================
       SET SUBMITTING STATE
       ===================================================== */

    function setSubmitting(
        submitting
    ) {

        submitBtn.disabled =
            submitting;


        submitBtn.classList.toggle(
            "loading",
            submitting
        );

    }


    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        async event => {

            /*
                Stop normal form submit
            */

            event.preventDefault();


            /*
                Clear old errors
            */

            clearAllErrors();


            /*
                Collect data
            */

            const payload =
                collectPayload();


            /*
                Validate
            */

            const errors =
                validate(
                    payload
                );


            /*
                Stop if validation failed
            */

            if (
                errors.length > 0
            ) {

                errors.forEach(
                    ([input, message]) => {

                        setFieldError(
                            input,
                            message
                        );

                    }
                );


                /*
                    Focus first invalid field
                */

                if (
                    errors[0] &&
                    errors[0][0]
                ) {

                    errors[0][0]
                        .focus?.();

                }


                return;

            }


            /*
                Start loading
            */

            setSubmitting(true);

            showState("loading");


            try {

                /*
                    Call FastAPI
                */

                const response =
                    await fetch(
                        `${API_BASE}/predict`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    payload
                                )

                        }
                    );


                /* =========================================
                   PYDANTIC VALIDATION ERROR
                   ========================================= */

                if (
                    response.status ===
                    422
                ) {

                    const body =
                        await response
                            .json()
                            .catch(
                                () => null
                            );


                    const matched =
                        body &&
                        applyServerErrors(
                            body.detail
                        );


                    renderError(
                        "Check your inputs",
                        matched
                            ? "Some fields were rejected by the API. Check the highlighted fields."
                            : "The API rejected this request. Please review your information."
                    );


                    return;

                }


                /* =========================================
                   OTHER SERVER ERROR
                   ========================================= */

                if (
                    !response.ok
                ) {

                    const body =
                        await response
                            .json()
                            .catch(
                                () => null
                            );


                    let message =
                        `FastAPI returned HTTP ${response.status}.`;


                    if (
                        body &&
                        typeof body.detail ===
                        "string"
                    ) {

                        message =
                            body.detail;

                    }


                    renderError(
                        "Prediction failed",
                        message
                    );


                    return;

                }


                /* =========================================
                   SUCCESS
                   ========================================= */

                const data =
                    await response.json();


                /*
                    Check expected response
                */

                if (
                    typeof
                    data.predicted_mental_health_score
                    !== "number"
                ) {

                    renderError(
                        "Invalid response",
                        "The API responded successfully, but the prediction score was missing."
                    );


                    return;

                }


                /*
                    Render score
                */

                renderResult(
                    data.predicted_mental_health_score
                );

            }


            catch (error) {

                console.error(
                    "FastAPI Error:",
                    error
                );


                /*
                    Network / CORS /
                    server unavailable
                */

                renderError(
                    "Cannot reach FastAPI",
                    `Make sure FastAPI is running at ${API_BASE} and that the /predict endpoint is available.`
                );

            }


            finally {

                /*
                    Stop loading
                */

                setSubmitting(
                    false
                );

            }

        }
    );


    /* =====================================================
       LIVE VALIDATION
       ===================================================== */

    form
        .querySelectorAll(
            "input, select"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    clearFieldError(
                        input
                    );

                }
            );


            input.addEventListener(
                "change",
                () => {

                    clearFieldError(
                        input
                    );

                }
            );

        });


    /* =====================================================
       RUN ANOTHER ANALYSIS
       ===================================================== */

    resetBtn.addEventListener(
        "click",
        () => {

            /*
                Reset score
            */

            resetResultData();


            /*
                Go back to idle
            */

            showState(
                "idle"
            );

        }
    );


    /* =====================================================
       TRY AGAIN
       ===================================================== */

    errorRetryBtn.addEventListener(
        "click",
        () => {

            /*
                Reset prediction area
            */

            resetResultData();


            /*
                Go back to idle
            */

            showState(
                "idle"
            );

        }
    );


    /* =====================================================
       INITIAL PAGE STATE
       ===================================================== */

    resetResultData();

    showState(
        "idle"
    );

})();