package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
)

type EnrichRequest struct {
	Input string `json:"input"`
	TopK  int    `json:"top_k"`
}

type EnrichResult struct {
	Input      string      `json:"input"`
	Results    interface{} `json:"results"`
	TotalFound int         `json:"total_found"`
}

func CallEnrichService(equipmentName string, topK int) (*EnrichResult, error) {
	mlServiceURL := os.Getenv("ML_SERVICE_URL")
	if mlServiceURL == "" {
		mlServiceURL = "http://ml_service:8000"
	}
	reqBody := EnrichRequest{
		Input: equipmentName,
		TopK:  topK,
	}
	jsonData, _ := json.Marshal(reqBody)
	resp, err := http.Post(mlServiceURL+"/enrich", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("error enriching")
	}

	var result EnrichResult
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}
	return &result, nil
}
