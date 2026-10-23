"use client";

import { useForm } from "@tanstack/react-form";
import {
  CheckCircle2,
  FileQuestion,
  Mail,
  MessageSquare,
  Send,
  Tag,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { contactFormSchema } from "@/validation";

export default function ContactForm() {
  // console.log("contact form component loaded");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "TECHNICAL_SUPPORT" as const,
      message: "",
    },
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: async ({ value: _value }) => {
      // console.log("submitting contact message", _value);
      setIsSubmitting(true);

      // simulate api submission with realistic latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSubmitting(false);
      setIsSubmittedSuccess(true);

      toast.add({
        title: "Message Dispatched Successfully",
        description:
          "Thank you for reaching out! Our engineering and support team will reply within 15 minutes.",
        type: "success",
      });
    },
  });

  const handleSendAnother = () => {
    // console.log("resetting contact form for another message");
    form.reset();
    setIsSubmittedSuccess(false);
  };

  return (
    <Card className="border border-border/80 bg-card shadow-lg">
      <CardHeader className="p-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <MessageSquare className="size-4" />
          <span>Direct Dispatch</span>
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          Send Us a Message
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Fill out the form below. Technical queries during active candidate
          evaluations receive priority routing.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {isSubmittedSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                Inquiry Received!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Your message has been assigned a support ticket. A DevAssess
                engineer will contact you shortly.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendAnother}
                className="rounded-lg text-xs font-medium"
              >
                Send Another Message
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <FieldGroup className="gap-4">
              {/* row 1: name and email */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* full name */}
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="Alex Morgan"
                            className="pl-9"
                            aria-invalid={isInvalid}
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* email */}
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Work Email</FieldLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="alex@company.com"
                            className="pl-9"
                            aria-invalid={isInvalid}
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              {/* row 2: category and subject */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* inquiry category */}
                <form.Field name="category">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Inquiry Category
                        </FieldLabel>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value as
                                  | "TECHNICAL_SUPPORT"
                                  | "ASSESSMENT_INQUIRY"
                                  | "BILLING"
                                  | "ENTERPRISE_DEMO",
                              )
                            }
                            onBlur={field.handleBlur}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                          >
                            <option value="TECHNICAL_SUPPORT">
                              Technical / Exam Support
                            </option>
                            <option value="ASSESSMENT_INQUIRY">
                              Assessment Question Banks
                            </option>
                            <option value="BILLING">
                              Billing & bKash Credits
                            </option>
                            <option value="ENTERPRISE_DEMO">
                              Enterprise Demo & SLA
                            </option>
                          </select>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* subject */}
                <form.Field name="subject">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
                        <div className="relative">
                          <FileQuestion className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="e.g. Question bank custom test cases"
                            className="pl-9"
                            aria-invalid={isInvalid}
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              {/* message */}
              <form.Field name="message">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Detailed Message
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Please describe your technical question, assessment issue, or enterprise requirements..."
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

            {/* submit button */}
            <div className="mt-2 flex items-center justify-end gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-36 font-semibold gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
