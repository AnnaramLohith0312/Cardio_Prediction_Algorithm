#!/bin/bash
# move_model.sh
# Ensure model and scaler are in the backend/models directory
cd "$(dirname "$0")/.."
mkdir -p models

if [ -f "../cardio_final_model.pkl" ]; then
    cp ../cardio_final_model.pkl models/
    echo "Copied cardio_final_model.pkl to backend/models/"
elif [ -f "cardio_final_model.pkl" ]; then
    mv cardio_final_model.pkl models/
    echo "Moved cardio_final_model.pkl to backend/models/"
fi

if [ -f "../cardio_scaler.pkl" ]; then
    cp ../cardio_scaler.pkl models/
    echo "Copied cardio_scaler.pkl to backend/models/"
elif [ -f "cardio_scaler.pkl" ]; then
    mv cardio_scaler.pkl models/
    echo "Moved cardio_scaler.pkl to backend/models/"
fi
