import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

function HospitalRegister() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Hospital details supported by HospitalProfile.
    const [hospitalName, setHospitalName] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [hospitalEmail, setHospitalEmail] = useState("");
    const [hospitalPhone, setHospitalPhone] = useState("");
    const [address, setAddress] = useState("");

    // Administrator account details supported by User.
    const [adminName, setAdminName] = useState("");
    const [username, setUsername] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        console.log("Hospital email:", JSON.stringify(hospitalEmail));

        try {
            // Register through Django, not Firebase.
            const response = await api.post("hospital-register/", {
                hospital_name: hospitalName.trim(),
                registration_number: registrationNumber.trim(),
                email: hospitalEmail.trim(),
                phone: hospitalPhone.trim(),
                address: address.trim(),
                username: username.trim(),
                full_name: adminName.trim(),
                admin_email: adminEmail.trim(),
                admin_phone: adminPhone.trim(),
                password,
            });

            // Save the JWT tokens returned by Django.
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("user_role", response.data.user.role);

            alert("Hospital registered! Your account is awaiting verification.");
            navigate("/login");
        } catch (err) {
            console.error("Hospital registration failed:", err.response?.data || err);

            const details = err.response?.data;
            if (details && typeof details === "object") {
                const messages = Object.entries(details)
                    .map(([field, value]) => {
                        const message = Array.isArray(value) ? value.join(" ") : String(value);
                        return `${field}: ${message}`;
                    })
                    .join("\n");

                setError(messages || "Registration failed. Please try again.");
            } else {
                setError("Could not reach the server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-red-50 p-6">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Hospital Registration</CardTitle>
                    <CardDescription>
                        Step {step} of 2
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-4 whitespace-pre-line rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <Label>Hospital Name</Label>
                                    <Input
                                        className="mt-2"
                                        value={hospitalName}
                                        onChange={(e) => setHospitalName(e.target.value)}
                                        placeholder="Nairobi West Hospital"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Facility Registration Number</Label>
                                    <Input
                                        className="mt-2"
                                        value={registrationNumber}
                                        onChange={(e) => setRegistrationNumber(e.target.value)}
                                        placeholder="Enter registration number"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Hospital Email</Label>
                                    <Input
                                        className="mt-2"
                                        type="email"
                                        value={hospitalEmail}
                                        onChange={(e) => setHospitalEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Hospital Phone</Label>
                                    <Input
                                        className="mt-2"
                                        type="tel"
                                        value={hospitalPhone}
                                        onChange={(e) => setHospitalPhone(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Physical Address</Label>
                                    <Input
                                        className="mt-2"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Town, road, or street address"
                                        required
                                    />
                                </div>

                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={() => setStep(2)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <Label>Administrator's Full Name</Label>
                                    <Input
                                        className="mt-2"
                                        value={adminName}
                                        onChange={(e) => setAdminName(e.target.value)}
                                        placeholder="Full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Username</Label>
                                    <Input
                                        className="mt-2"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Work Email</Label>
                                    <Input
                                        className="mt-2"
                                        type="email"
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        placeholder="admin@hospital.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Administrator's Phone</Label>
                                    <Input
                                        className="mt-2"
                                        type="tel"
                                        value={adminPhone}
                                        onChange={(e) => setAdminPhone(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Password (at least 8 characters)</Label>
                                    <Input
                                        className="mt-2"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={8}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>

                                <div className="flex justify-between gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        disabled={loading}
                                    >
                                        Back
                                    </Button>

                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Registering..." : "Create Hospital Account"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}

export default HospitalRegister;
