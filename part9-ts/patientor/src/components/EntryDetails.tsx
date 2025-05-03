import { Typography } from "@mui/material";
import type {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  CodeNameMap,
} from "../types";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";
import WorkIcon from "@mui/icons-material/Work";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const getEntryIcon = (entry: Entry) => {
  switch (entry.type) {
    case "Hospital":
      return <LocalHospitalIcon color="error" />;
    case "HealthCheck":
      return <FavoriteIcon color="primary" />;
    case "OccupationalHealthcare":
      return <WorkIcon color="success" />;
    default:
      return assertNever(entry);
  }
};

const HospitalEntry = ({
  entry,
  codesMap,
}: {
  entry: HospitalEntry;
  codesMap: CodeNameMap;
}) => {
  const typeIcon = getEntryIcon(entry);

  return (
    <div style={{ border: "1px solid black", borderRadius: "2px" }}>
      <Typography align="left" variant="body2">
        {entry.date} <strong>{typeIcon}</strong>
      </Typography>
      <Typography align="left" variant="body2">
        <em>{entry.description}</em>
      </Typography>
      <Typography align="left" variant="body2">
        Seen by: {entry.specialist}
      </Typography>
      <Typography align="left" variant="body2">
        Discharged: {entry.discharge.date} <em>{entry.discharge.criteria}</em>
      </Typography>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {codesMap[code] ?? "n/a"}
          </li>
        ))}
      </ul>
    </div>
  );
};

const OccupationalHealthcareEntry = ({
  entry,
  codesMap,
}: {
  entry: OccupationalHealthcareEntry;
  codesMap: CodeNameMap;
}) => {
  const typeIcon = getEntryIcon(entry);

  return (
    <div style={{ border: "1px solid black", borderRadius: "2px" }}>
      <Typography align="left" variant="body2">
        {entry.date} <strong>{typeIcon}</strong> {entry.employerName}
      </Typography>
      <Typography align="left" variant="body2">
        <em>{entry.description}</em>
      </Typography>
      <Typography align="left" variant="body2">
        Seen by: {entry.specialist}
      </Typography>
      {entry.sickLeave && (
        <Typography align="left" variant="body2">
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </Typography>
      )}
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {codesMap[code] ?? "n/a"}
          </li>
        ))}
      </ul>
    </div>
  );
};

const HealthCheckEntry = ({
  entry,
  codesMap,
}: {
  entry: HealthCheckEntry;
  codesMap: CodeNameMap;
}) => {
  const typeIcon = getEntryIcon(entry);

  return (
    <div style={{ border: "1px solid black", borderRadius: "2px" }}>
      <Typography align="left" variant="body2">
        {entry.date} <strong>{typeIcon}</strong>
      </Typography>
      <Typography align="left" variant="body2">
        <em>{entry.description}</em>
      </Typography>
      <Typography align="left" variant="body2">
        Seen by: {entry.specialist}
      </Typography>
      <Typography align="left" variant="body2">
        Health rating: {entry.healthCheckRating}
      </Typography>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {codesMap[code] ?? "n/a"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const EntryDetails = ({
  entry,
  codesMap,
}: {
  entry: Entry;
  codesMap: CodeNameMap;
}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} codesMap={codesMap} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry entry={entry} codesMap={codesMap} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} codesMap={codesMap} />;
    default:
      return assertNever(entry);
  }
};
