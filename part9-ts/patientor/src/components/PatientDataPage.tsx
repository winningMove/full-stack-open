import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import type { Diagnosis, Patient, CodeNameMap } from "../types";
import { EntryDetails } from "./EntryDetails";

interface Props {
  diagnoses: Diagnosis[];
}

const fetchPatientData = async (id: string): Promise<Patient> => {
  const patient = await patientService.getOne(id!);
  return patient;
};

const PatientDataPage = ({ diagnoses }: Props) => {
  const { id } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["patientInfo", id],
    queryFn: () => {
      return fetchPatientData(id!);
    },
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Error fetching patient data</p>;

  const diagnosisCodesToNames = diagnoses.reduce<CodeNameMap>((acc, el) => {
    acc[el.code] = el.name;
    return acc;
  }, {});

  return (
    <div>
      <Box>
        <Typography align="left" variant="h5">
          {data.name}
        </Typography>
        <Typography align="left" variant="body1">
          gender: {data.gender}
        </Typography>
        <Typography align="left" variant="body1">
          ssn: {data.ssn}
        </Typography>
        <Typography align="left" variant="body1">
          occupation: {data.occupation}
        </Typography>
        <Typography align="left" variant="h6">
          entries:
        </Typography>
        {data.entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              margin: "8px 0",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <EntryDetails entry={entry} codesMap={diagnosisCodesToNames} />
          </div>
        ))}
      </Box>
    </div>
  );
};

export default PatientDataPage;
