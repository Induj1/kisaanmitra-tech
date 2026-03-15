
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardWidget from "@/components/DashboardWidget";
import AlertMessage from "@/components/AlertMessage";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  cropType: z.string().min(2, { message: "Please enter a valid crop type" }),
  landSize: z.string().min(1, { message: "Please enter land size" }),
  landUnit: z.string().min(1, { message: "Please select a unit" }),
  sowingDate: z.date({ required_error: "Please select a sowing date" }),
  cultivationMethod: z.enum(["organic", "traditional", "hybrid", "modern", "other"], {
    required_error: "Please select a cultivation method",
  }),
  wateringMethod: z.enum(["drip", "sprinkler", "manual", "flood", "other"], {
    required_error: "Please select a watering method",
  }),
  seedType: z.string().min(2, { message: "Please provide seed information" }),
  seedSource: z.string().min(2, { message: "Please enter seed source" }),
  fertilizers: z.string().optional(),
  pesticides: z.string().optional(),
  problems: z.string().min(2, { message: "Please describe any problems faced" }),
  harvestOutcome: z.enum(["good", "average", "poor"], {
    required_error: "Please select harvest outcome",
  }),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CropAnalysisForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      landSize: "",
      landUnit: "acres",
      fertilizers: "",
      pesticides: "",
      seedType: "",
      seedSource: "",
      problems: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: insertedData, error } = await supabase
        .from('crop_analysis')
        .insert({
          crop_type: data.cropType,
          land_size: `${data.landSize} ${data.landUnit}`,
          sowing_date: data.sowingDate.toISOString(),
          cultivation_method: data.cultivationMethod,
          watering_method: data.wateringMethod,
          seed_type: data.seedType,
          seed_source: data.seedSource,
          fertilizers: data.fertilizers || null,
          pesticides: data.pesticides || null,
          problems: data.problems,
          harvest_outcome: data.harvestOutcome,
          additional_notes: data.additionalNotes || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select('id')
        .single();

      if (error) throw error;
      
      if (!insertedData?.id) {
        throw new Error("Failed to get the report ID");
      }

      toast({
        title: "Analysis Request Submitted",
        description: "Your crop data has been successfully submitted for analysis.",
      });

      navigate(`/crop-analysis/report?id=${insertedData.id}`);
    } catch (error) {
      console.error("Error submitting crop analysis:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardWidget
      title="Crop Analysis Form"
      description="Submit your crop cultivation details to receive personalized recommendations"
      icon={CalendarIcon}
      iconColor="text-green-600"
      iconBgColor="bg-green-100"
    >
      <AlertMessage
        title="Share Your Farming Experience"
        message="The more details you provide, the more accurate our recommendations will be."
        type="info"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wheat, Rice, Cotton" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="landSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Land Size</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="landUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="hectares">Hectares</SelectItem>
                        <SelectItem value="bigha">Bigha</SelectItem>
                        <SelectItem value="gunta">Gunta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="sowingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sowing Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cultivationMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Cultivation Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="organic" />
                        </FormControl>
                        <FormLabel className="font-normal">Organic</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="traditional" />
                        </FormControl>
                        <FormLabel className="font-normal">Traditional</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hybrid" />
                        </FormControl>
                        <FormLabel className="font-normal">Hybrid</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="modern" />
                        </FormControl>
                        <FormLabel className="font-normal">Modern</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wateringMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Watering Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="drip" />
                        </FormControl>
                        <FormLabel className="font-normal">Drip Irrigation</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sprinkler" />
                        </FormControl>
                        <FormLabel className="font-normal">Sprinkler</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="manual" />
                        </FormControl>
                        <FormLabel className="font-normal">Manual</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="flood" />
                        </FormControl>
                        <FormLabel className="font-normal">Flood</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="seedType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seed Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hybrid, Native, GMO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seedSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seed Source</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Local market, Government" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fertilizers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fertilizers Used</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any fertilizers you used (type, quantity, frequency)"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pesticides"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pesticides/Insecticides Used</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any pesticides or insecticides used"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major Problems Faced</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any issues like pests, diseases, weather problems"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harvestOutcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harvest Outcome</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-6"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="good" />
                      </FormControl>
                      <FormLabel className="font-normal text-green-600">Good</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="average" />
                      </FormControl>
                      <FormLabel className="font-normal text-yellow-600">Average</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="poor" />
                      </FormControl>
                      <FormLabel className="font-normal text-red-600">Poor</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any other information about your cultivation experience"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit for Analysis</Button>
        </form>
      </Form>
    </DashboardWidget>
  );
};

export default CropAnalysisForm;
